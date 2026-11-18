import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/admin-auth";
import { getSecurityConfig, sendSecurityEmail } from "@/lib/admin-security";

export async function POST(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const config = getSecurityConfig();
    const testCode = Math.floor(100000 + Math.random() * 900000).toString();

    const targetEmail =
      config.securityEmail && !config.securityEmail.includes("felipepetri")
        ? config.securityEmail
        : "entreasilhasturismo@gmail.com";

    const result = await sendSecurityEmail({
      to: targetEmail,
      subject: "🧪 Teste de Conexão 2FA Entre as Ilhas",
      code: testCode,
      username: config.username
    });

    return NextResponse.json({
      success: result.success,
      method: result.method,
      message: result.message
    });
  } catch (error) {
    console.error("Erro ao testar envio de email:", error);
    return NextResponse.json(
      { error: "Falha ao disparar email de teste." },
      { status: 500 }
    );
  }
}
