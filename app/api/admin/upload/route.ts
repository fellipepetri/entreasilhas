import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isRequestAuthenticated } from "@/lib/admin-auth";
import {
  optimizeVideoBuffer,
  optimizeImageBuffer
} from "@/lib/media-optimizer";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-matroska",
  "video/mp4v-es"
]);

const VIDEO_EXTENSIONS = new Set([
  ".mp4",
  ".webm",
  ".ogg",
  ".mov",
  ".m4v",
  ".mkv"
]);

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".avif"
]);

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB máximo aceito no upload

export async function POST(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Arquivo muito grande. O limite máximo é de 100MB." },
        { status: 400 }
      );
    }

    const originalName = file.name || "midia";
    const rawExtension = path.extname(originalName).toLowerCase() || "";

    // Detecção segura: verifica tanto o MIME type quanto a extensão real do arquivo
    const isVideo =
      file.type.startsWith("video/") || VIDEO_EXTENSIONS.has(rawExtension);
    const isImage =
      file.type.startsWith("image/") || IMAGE_EXTENSIONS.has(rawExtension);

    if (!ALLOWED_MIME_TYPES.has(file.type) && !isVideo && !isImage) {
      return NextResponse.json(
        {
          error:
            "Formato não suportado. Envie imagens (JPG, PNG, WebP, SVG, GIF) ou vídeos (MP4, WebM, MOV)."
        },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const baseName = path
      .basename(originalName, rawExtension)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 32);

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    let finalBuffer: Buffer;
    let finalExt: string;
    let originalSize = rawBuffer.length;
    let newSize = rawBuffer.length;

    const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    if (isVideo) {
      // Otimização de vídeo: Converte para MP4 universal H.264 1080p, taxa de bits controlada, sem áudio e FastStart
      const result = await optimizeVideoBuffer(rawBuffer, originalName);
      finalBuffer = result.buffer;
      finalExt = ".mp4";
      originalSize = result.originalSize;
      newSize = result.newSize;
    } else {
      // Otimização de imagem: Converte para WebP 80 com resolução preservada
      const result = await optimizeImageBuffer(rawBuffer, file.type || "image/jpeg");
      finalBuffer = result.buffer;
      finalExt = `.${result.format}`;
      originalSize = result.originalSize;
      newSize = result.newSize;
    }

    const finalFileName = `${baseName}-${uniqueSuffix}${finalExt}`;
    const destinationPath = path.join(uploadsDir, finalFileName);

    await fs.writeFile(destinationPath, finalBuffer);

    const publicUrl = `/uploads/${finalFileName}`;
    const reductionPercent =
      originalSize > 0
        ? Math.max(0, Math.round((1 - newSize / originalSize) * 100))
        : 0;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: finalFileName,
      size: newSize,
      originalSize,
      reductionPercent,
      format: finalExt.replace(".", "")
    });
  } catch (error) {
    console.error("Erro no processamento de upload:", error);
    return NextResponse.json(
      { error: "Falha ao processar e otimizar o arquivo enviado." },
      { status: 500 }
    );
  }
}
