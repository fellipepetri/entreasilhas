import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/admin-auth";
import { getSiteContent, saveSiteContent } from "@/lib/content-store";

export async function GET(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const content = await getSiteContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json(
      { error: "Erro ao carregar conteúdo do site" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await saveSiteContent(body);
    return NextResponse.json({
      success: true,
      message: "Conteúdo atualizado com sucesso!",
      content: updated
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao salvar alterações no conteúdo" },
      { status: 500 }
    );
  }
}
