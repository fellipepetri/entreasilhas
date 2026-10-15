import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/admin-auth";
import { resetSiteContent } from "@/lib/content-store";

export async function POST(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const defaultData = await resetSiteContent();
    return NextResponse.json({
      success: true,
      message: "Conteúdo restaurado para os padrões com sucesso!",
      content: defaultData
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao restaurar dados padrão" },
      { status: 500 }
    );
  }
}
