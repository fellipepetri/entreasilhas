import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isRequestAuthenticated } from "@/lib/admin-auth";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif"
]);

const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024; // 30 MB (para fotos e panoramas 360)

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
        { error: "Arquivo muito grande. O limite máximo é de 30MB." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error:
            "Formato não suportado. Envie imagens JPG, PNG, WebP, SVG ou GIF."
        },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Nome sanitizado e único
    const originalName = file.name || "imagem";
    const extension = path.extname(originalName) || ".jpg";
    const baseName = path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 32);

    const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const finalFileName = `${baseName}-${uniqueSuffix}${extension}`;
    const destinationPath = path.join(uploadsDir, finalFileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(destinationPath, buffer);

    const publicUrl = `/uploads/${finalFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: finalFileName,
      size: file.size
    });
  } catch {
    return NextResponse.json(
      { error: "Falha ao processar o upload do arquivo." },
      { status: 500 }
    );
  }
}
