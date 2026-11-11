import os from "os";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import { execFileSync, execSync } from "child_process";
import sharp from "sharp";

/**
 * Localiza o binário do FFmpeg no sistema ou pacote estático
 */
export function getFfmpegPath(): string | null {
  // 1. ffmpeg-static npm package (se instalado)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ffmpegStatic = require("ffmpeg-static");
    if (
      ffmpegStatic &&
      typeof ffmpegStatic === "string" &&
      fsSync.existsSync(ffmpegStatic)
    ) {
      return ffmpegStatic;
    }
  } catch {
    // Ignora
  }

  // 2. PATH do sistema (Docker Alpine com 'apk add ffmpeg', Linux, Windows)
  try {
    const whichCmd =
      process.platform === "win32" ? "where.exe ffmpeg" : "which ffmpeg";
    const out = execSync(whichCmd, { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim()
      .split(/\r?\n/)[0];
    if (out && fsSync.existsSync(out)) {
      return out;
    }
  } catch {
    // Ignora
  }

  // 3. Caminhos padrão Unix / Docker
  if (fsSync.existsSync("/usr/bin/ffmpeg")) return "/usr/bin/ffmpeg";
  if (fsSync.existsSync("/usr/local/bin/ffmpeg")) return "/usr/local/bin/ffmpeg";

  return null;
}

/**
 * Reordena os átomos de um MP4 (FastStart) em puro Node.js
 * Garante que 'moov' fique antes de 'mdat' para streaming imediato sem carregar todo o arquivo.
 */
function applyPureJsFastStart(buffer: Buffer): Buffer {
  try {
    let offset = 0;
    const atoms: Array<{ type: string; start: number; size: number }> = [];

    while (offset < buffer.length) {
      if (offset + 8 > buffer.length) break;
      const size32 = buffer.readUInt32BE(offset);
      const type = buffer.slice(offset + 4, offset + 8).toString("latin1");

      let atomSize = size32;
      if (size32 === 1) {
        if (offset + 16 > buffer.length) break;
        atomSize = Number(buffer.readBigUInt64BE(offset + 8));
      } else if (size32 === 0) {
        atomSize = buffer.length - offset;
      }

      atoms.push({ type, start: offset, size: atomSize });
      offset += atomSize;
      if (atomSize <= 0) break;
    }

    const moovIdx = atoms.findIndex((a) => a.type === "moov");
    const mdatIdx = atoms.findIndex((a) => a.type === "mdat");

    // Já está com moov antes de mdat ou falta algum átomo essencial
    if (moovIdx === -1 || mdatIdx === -1 || moovIdx < mdatIdx) {
      return buffer;
    }

    const ftyp = atoms.find((a) => a.type === "ftyp");
    const moov = atoms[moovIdx];
    const mdat = atoms[mdatIdx];

    const ftypBuf = ftyp
      ? buffer.slice(ftyp.start, ftyp.start + ftyp.size)
      : Buffer.alloc(0);
    const moovBuf = Buffer.from(
      buffer.slice(moov.start, moov.start + moov.size)
    );
    const mdatBuf = buffer.slice(mdat.start, mdat.start + mdat.size);

    // Ajusta stco (sample chunk offsets de 32 bits) dentro de moov para compensar a nova posição
    const moovShift = moov.size;
    let scanPos = 0;
    while (scanPos < moovBuf.length - 8) {
      const subType = moovBuf
        .slice(scanPos + 4, scanPos + 8)
        .toString("latin1");
      if (subType === "stco") {
        const entryCount = moovBuf.readUInt32BE(scanPos + 12);
        for (let i = 0; i < entryCount; i++) {
          const entryOffset = scanPos + 16 + i * 4;
          if (entryOffset + 4 <= moovBuf.length) {
            const currentOffset = moovBuf.readUInt32BE(entryOffset);
            moovBuf.writeUInt32BE(currentOffset + moovShift, entryOffset);
          }
        }
      }
      scanPos += 4;
    }

    return Buffer.concat([ftypBuf, moovBuf, mdatBuf]);
  } catch (err) {
    console.warn("Aviso ao aplicar FastStart puro:", err);
    return buffer;
  }
}

/**
 * Otimiza e converte vídeo para MP4 ultra-leve compatível com todos os navegadores
 */
export async function optimizeVideoBuffer(
  inputBuffer: Buffer,
  originalFileName: string
): Promise<{
  buffer: Buffer;
  format: string;
  mimeType: string;
  originalSize: number;
  newSize: number;
}> {
  const originalSize = inputBuffer.length;
  const ffmpegPath = getFfmpegPath();

  if (!ffmpegPath) {
    console.log(
      "FFmpeg não detectado. Aplicando FastStart nativo para streaming direto..."
    );
    const fastStarted = applyPureJsFastStart(inputBuffer);
    return {
      buffer: fastStarted,
      format: "mp4",
      mimeType: "video/mp4",
      originalSize,
      newSize: fastStarted.length
    };
  }

  const tempId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const ext = path.extname(originalFileName) || ".mp4";
  const tempInput = path.join(os.tmpdir(), `upload_raw_${tempId}${ext}`);
  const tempOutput = path.join(os.tmpdir(), `upload_opt_${tempId}.mp4`);

  try {
    await fs.writeFile(tempInput, inputBuffer);

    // Converte para H.264 (Universal), remove áudio (vídeo de fundo mudo economiza ~30%),
    // ajusta dimensões pares, aplica CRF 26 (qualidade cristalina e leveza extrema) e move moov para o início (+faststart)
    const args = [
      "-y",
      "-i",
      tempInput,
      "-c:v",
      "libx264",
      "-crf",
      "26",
      "-preset",
      "fast",
      "-an",
      "-pix_fmt",
      "yuv420p",
      "-vf",
      "scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-movflags",
      "+faststart",
      tempOutput
    ];

    execFileSync(ffmpegPath, args, {
      stdio: ["ignore", "ignore", "ignore"],
      timeout: 90000
    });

    const outputBuffer = await fs.readFile(tempOutput);

    return {
      buffer: outputBuffer,
      format: "mp4",
      mimeType: "video/mp4",
      originalSize,
      newSize: outputBuffer.length
    };
  } catch (err) {
    console.warn(
      "Falha na conversão FFmpeg, aplicando FastStart alternativo:",
      err
    );
    const fallbackBuffer = applyPureJsFastStart(inputBuffer);
    return {
      buffer: fallbackBuffer,
      format: "mp4",
      mimeType: "video/mp4",
      originalSize,
      newSize: fallbackBuffer.length
    };
  } finally {
    try {
      await fs.unlink(tempInput).catch(() => {});
      await fs.unlink(tempOutput).catch(() => {});
    } catch {
      // Ignora limpeza de temporários
    }
  }
}

/**
 * Otimiza e converte imagens para WebP ultra-leve com resolução e nitidez preservadas
 */
export async function optimizeImageBuffer(
  inputBuffer: Buffer,
  mimeType: string
): Promise<{
  buffer: Buffer;
  format: string;
  mimeType: string;
  originalSize: number;
  newSize: number;
}> {
  const originalSize = inputBuffer.length;

  // Se for SVG, preserva vetor original
  if (mimeType === "image/svg+xml") {
    return {
      buffer: inputBuffer,
      format: "svg",
      mimeType: "image/svg+xml",
      originalSize,
      newSize: originalSize
    };
  }

  try {
    const image = sharp(inputBuffer, { failOnError: false });
    const metadata = await image.metadata();

    let pipeline = image.rotate(); // auto-rotação conforme EXIF

    // Se a imagem for gigantesca (> 2560px), limita em 2560px para tela 4K
    if (metadata.width && metadata.width > 2560) {
      pipeline = pipeline.resize({
        width: 2560,
        withoutEnlargement: true,
        fit: "inside"
      });
    }

    const outputBuffer = await pipeline
      .webp({
        quality: 85,
        effort: 4,
        smartSubsample: true
      })
      .toBuffer();

    return {
      buffer: outputBuffer,
      format: "webp",
      mimeType: "image/webp",
      originalSize,
      newSize: outputBuffer.length
    };
  } catch (err) {
    console.warn("Aviso ao otimizar imagem com Sharp, mantendo original:", err);
    return {
      buffer: inputBuffer,
      format: mimeType.split("/")[1] || "jpg",
      mimeType,
      originalSize,
      newSize: originalSize
    };
  }
}
