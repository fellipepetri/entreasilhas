import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isRequestAuthenticated } from "@/lib/admin-auth";

interface MediaItem {
  fileName: string;
  url: string;
  size: number;
  formattedSize: string;
  type: "video" | "image" | "other";
  extension: string;
  updatedAt: string;
  usedIn: string[];
  isOrphan: boolean;
}

const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov", "m4v", "ogg", "mkv"]);
const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"]);

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function findUsagesInJson(content: unknown, targetUrl: string, targetName: string): string[] {
  const usages: string[] = [];

  function traverse(node: unknown, currentPath: string) {
    if (!node) return;

    if (typeof node === "string") {
      if (node.includes(targetUrl) || node.includes(targetName)) {
        usages.push(friendlyLocation(currentPath, content));
      }
      return;
    }

    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        traverse(item, `${currentPath}[${index}]`);
      });
      return;
    }

    if (typeof node === "object") {
      for (const [key, val] of Object.entries(node as Record<string, unknown>)) {
        traverse(val, currentPath ? `${currentPath}.${key}` : key);
      }
    }
  }

  traverse(content, "");
  // Remove duplicados preservando a ordem
  return Array.from(new Set(usages));
}

function friendlyLocation(jsonPath: string, rootContent: unknown): string {
  const content = rootContent as Record<string, unknown>;

  // Hero Slides
  const heroMatch = jsonPath.match(/^heroSlides\[(\d+)\]\.(video|image|poster)/);
  if (heroMatch) {
    const idx = parseInt(heroMatch[1]) + 1;
    const field = heroMatch[2];
    const label = field === "video" ? "Vídeo" : field === "poster" ? "Foto de Capa" : "Foto";
    return `Slide ${idx} do Hero (${label})`;
  }

  // CTA / Chamada Final
  if (jsonPath.includes("cta.backgroundVideo") || jsonPath.includes("cta.video")) {
    return "Chamada Final / CTA (Vídeo de Fundo)";
  }
  if (jsonPath.includes("cta.backgroundImage") || jsonPath.includes("cta.image")) {
    return "Chamada Final / CTA (Foto de Fundo)";
  }

  // Sobre a Agência
  if (jsonPath.startsWith("about.mainImage")) return "Sobre a Agência (Foto Principal)";
  if (jsonPath.startsWith("about.secondaryImage")) return "Sobre a Agência (Foto Secundária)";

  // Roteiros
  const routeMatch = jsonPath.match(/^routes\.bookingRoutes\[(\d+)\]/);
  if (routeMatch) {
    const idx = parseInt(routeMatch[1]);
    const routesObj = content?.routes as { bookingRoutes?: Array<{ title?: string }> } | undefined;
    const title = routesObj?.bookingRoutes?.[idx]?.title;
    return `Roteiros & Passeios (${title || `Item ${idx + 1}`})`;
  }

  // Galeria de Fotos
  const galleryMatch = jsonPath.match(/^gallery\[(\d+)\]/);
  if (galleryMatch) {
    const idx = parseInt(galleryMatch[1]) + 1;
    return `Galeria de Fotos (Item #${idx})`;
  }

  // Experiência 360
  const sceneMatch = jsonPath.match(/^experience360\.scenes\[(\d+)\]/);
  if (sceneMatch) {
    const idx = parseInt(sceneMatch[1]);
    const expObj = content?.experience360 as { scenes?: Array<{ title?: string }> } | undefined;
    const title = expObj?.scenes?.[idx]?.title;
    return `Experiência 360° (${title || `Cena ${idx + 1}`})`;
  }

  // Depoimentos
  const testMatch = jsonPath.match(/^testimonials\.testimonials\[(\d+)\]/);
  if (testMatch) {
    const idx = parseInt(testMatch[1]);
    const testObj = content?.testimonials as { testimonials?: Array<{ name?: string }> } | undefined;
    const name = testObj?.testimonials?.[idx]?.name;
    return `Depoimentos (${name || `Item ${idx + 1}`})`;
  }

  // Instagram
  const instaMatch = jsonPath.match(/^instagram\.posts\[(\d+)\]/);
  if (instaMatch) {
    const idx = parseInt(instaMatch[1]) + 1;
    return `Instagram Feed (Post #${idx})`;
  }

  return jsonPath;
}

export async function GET(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Carrega o conteúdo do site para mapear o uso das mídias
    let siteContent: unknown = null;
    const contentFilePath = path.join(process.cwd(), "data", "site-content.json");
    try {
      const contentRaw = await fs.readFile(contentFilePath, "utf-8");
      siteContent = JSON.parse(contentRaw);
    } catch {
      // Se não existir, tenta carregar default
    }

    const entries = await fs.readdir(uploadsDir, { withFileTypes: true });
    const mediaItems: MediaItem[] = [];

    let totalSizeBytes = 0;
    let imagesCount = 0;
    let videosCount = 0;
    let orphanedCount = 0;

    for (const entry of entries) {
      if (!entry.isFile() || entry.name === ".gitkeep" || entry.name.startsWith(".")) {
        continue;
      }

      const filePath = path.join(uploadsDir, entry.name);
      const stat = await fs.stat(filePath);
      const ext = path.extname(entry.name).toLowerCase().replace(".", "");

      let type: "video" | "image" | "other" = "other";
      if (VIDEO_EXTENSIONS.has(ext)) {
        type = "video";
        videosCount++;
      } else if (IMAGE_EXTENSIONS.has(ext)) {
        type = "image";
        imagesCount++;
      }

      totalSizeBytes += stat.size;

      const url = `/uploads/${entry.name}`;
      const usedIn = siteContent ? findUsagesInJson(siteContent, url, entry.name) : [];
      const isOrphan = usedIn.length === 0;

      if (isOrphan) {
        orphanedCount++;
      }

      mediaItems.push({
        fileName: entry.name,
        url,
        size: stat.size,
        formattedSize: formatBytes(stat.size),
        type,
        extension: ext.toUpperCase(),
        updatedAt: stat.mtime.toISOString(),
        usedIn,
        isOrphan
      });
    }

    // Ordena arquivos pelos mais recentes primeiro
    mediaItems.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({
      success: true,
      files: mediaItems,
      stats: {
        totalFiles: mediaItems.length,
        totalSizeBytes,
        totalSizeFormatted: formatBytes(totalSizeBytes),
        imagesCount,
        videosCount,
        orphanedCount
      }
    });
  } catch (error) {
    console.error("Erro ao listar mídias:", error);
    return NextResponse.json(
      { error: "Falha ao consultar arquivos de mídia." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fileName, deleteOrphaned } = body;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Exclusão em lote de todos os arquivos órfãos / não utilizados
    if (deleteOrphaned) {
      let siteContent: unknown = null;
      const contentFilePath = path.join(process.cwd(), "data", "site-content.json");
      try {
        const contentRaw = await fs.readFile(contentFilePath, "utf-8");
        siteContent = JSON.parse(contentRaw);
      } catch {}

      const entries = await fs.readdir(uploadsDir, { withFileTypes: true });
      const deletedFiles: string[] = [];

      for (const entry of entries) {
        if (!entry.isFile() || entry.name === ".gitkeep" || entry.name.startsWith(".")) {
          continue;
        }

        const url = `/uploads/${entry.name}`;
        const usedIn = siteContent ? findUsagesInJson(siteContent, url, entry.name) : [];

        if (usedIn.length === 0) {
          const filePath = path.join(uploadsDir, entry.name);
          await fs.unlink(filePath);
          deletedFiles.push(entry.name);
        }
      }

      return NextResponse.json({
        success: true,
        message: `${deletedFiles.length} arquivo(s) não utilizado(s) excluído(s) com sucesso.`,
        deletedCount: deletedFiles.length,
        deletedFiles
      });
    }

    // Exclusão de arquivo individual
    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json(
        { error: "Nome do arquivo é obrigatório para exclusão." },
        { status: 400 }
      );
    }

    const safeName = path.basename(fileName);
    if (
      safeName !== fileName ||
      fileName.includes("..") ||
      fileName.includes("/") ||
      fileName.includes("\\") ||
      fileName === ".gitkeep"
    ) {
      return NextResponse.json(
        { error: "Nome de arquivo inválido ou não permitido." },
        { status: 400 }
      );
    }

    const targetPath = path.join(uploadsDir, safeName);

    try {
      await fs.unlink(targetPath);
      return NextResponse.json({
        success: true,
        message: `Arquivo ${safeName} excluído com sucesso.`,
        fileName: safeName
      });
    } catch {
      return NextResponse.json(
        { error: "Arquivo não encontrado ou já excluído." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao excluir mídia:", error);
    return NextResponse.json(
      { error: "Falha ao excluir arquivo de mídia." },
      { status: 500 }
    );
  }
}
