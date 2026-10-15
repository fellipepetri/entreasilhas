import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, telefone, tipo, mensagem } = body || {};

    if (!nome || !email || !telefone || !tipo || !mensagem) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    // Registra o contato recebido no console do servidor para acompanhamento
    console.log("[Novo Contato Recebido]", {
      data: new Date().toISOString(),
      nome,
      email,
      telefone,
      tipo,
      mensagem
    });

    return NextResponse.json({
      success: true,
      message: "Mensagem recebida com sucesso!"
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar mensagem." },
      { status: 500 }
    );
  }
}
