import { NextResponse } from "next/server";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { Readable } from "stream";

export const dynamic = "force-dynamic";

const MIME_MAP: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml"
};

type RouteProps = {
  params: Promise<{
    file: string[];
  }>;
};

export async function GET(request: Request, props: RouteProps) {
  try {
    const { file } = await props.params;
    if (!file || file.length === 0) {
      return new Response("Arquivo não especificado", { status: 400 });
    }

    const relativePath = file.join("/");

    // Prevenção contra Directory Traversal
    if (relativePath.includes("..") || path.isAbsolute(relativePath)) {
      return new Response("Acesso negado", { status: 403 });
    }

    // Proteção de Mídia: Evita acesso direto pela barra de navegação do browser (sec-fetch-dest: document)
    // Visitantes comuns que tentarem colar o link diretamente no navegador são redirecionados para a Home
    const secFetchDest = request.headers.get("sec-fetch-dest");
    const secFetchMode = request.headers.get("sec-fetch-mode");
    if (secFetchDest === "document" || secFetchMode === "navigate") {
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }

    // Bloqueia hotlinking externo de outros domínios
    const secFetchSite = request.headers.get("sec-fetch-site");
    if (secFetchSite === "cross-site") {
      return new Response("Acesso externo não permitido", { status: 403 });
    }

    // Procura o arquivo nas pastas de mídia do projeto
    const publicRoot = path.join(/*turbopackIgnore: true*/ process.cwd(), "public");
    const searchDirs = [
      path.join(publicRoot, "uploads"),
      path.join(publicRoot, "videos"),
      path.join(publicRoot, "images")
    ];

    let targetPath: string | null = null;

    for (const dir of searchDirs) {
      const candidate = path.join(dir, relativePath);
      if (fsSync.existsSync(candidate)) {
        targetPath = candidate;
        break;
      }
    }

    // Fallback inteligente para variantes de nome (ex: loreto_slide_slow-timestamp.mp4 -> loreto_slide_slow.mp4)
    if (!targetPath) {
      const baseName = path.basename(relativePath).split("-")[0];
      const ext = path.extname(relativePath);
      for (const dir of searchDirs) {
        const candidate = path.join(dir, `${baseName}${ext}`);
        if (fsSync.existsSync(candidate)) {
          targetPath = candidate;
          break;
        }
      }
    }

    if (!targetPath || !fsSync.existsSync(targetPath)) {
      return new Response("Arquivo não encontrado", { status: 404 });
    }

    const stat = await fs.stat(targetPath);
    const fileSize = stat.size;
    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";

    const isVideo = contentType.startsWith("video/");
    const rangeHeader = request.headers.get("range");

    // Headers comuns de segurança e entrega de mídia
    const securityHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": "inline", // Força exibição no player sem baixar o arquivo
      "Accept-Ranges": "bytes",
      "X-Content-Type-Options": "nosniff",
      "Cross-Origin-Resource-Policy": "same-origin",
      "Cache-Control": "public, max-age=31536000, immutable"
    };

    // Suporte a HTTP 206 Partial Content (Range Streaming para vídeos MP4/WebM)
    if (rangeHeader && isVideo) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize || start > end) {
        return new Response("Faixa solicitada não satisfatória", {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileSize}`
          }
        });
      }

      const chunkSize = end - start + 1;
      const nodeStream = fsSync.createReadStream(targetPath, { start, end });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const webStream = Readable.toWeb(nodeStream) as any;

      return new Response(webStream, {
        status: 206,
        headers: {
          ...securityHeaders,
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Content-Length": String(chunkSize)
        }
      });
    }

    // Entrega normal (200 OK)
    const nodeStream = fsSync.createReadStream(targetPath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webStream = Readable.toWeb(nodeStream) as any;

    return new Response(webStream, {
      status: 200,
      headers: {
        ...securityHeaders,
        "Content-Length": String(fileSize)
      }
    });
  } catch (error) {
    console.error("Erro ao servir mídia:", error);
    return new Response("Erro interno do servidor", { status: 500 });
  }
}
