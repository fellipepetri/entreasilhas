import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/admin-auth";
import { verifyTwoFactorChallenge } from "@/lib/admin-security";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tempToken, code } = body;

    if (!tempToken || !code) {
      return NextResponse.json(
        { error: "Token temporário e código de 6 dígitos são obrigatórios." },
        { status: 400 }
      );
    }

    const result = verifyTwoFactorChallenge(tempToken, code);

    if (!result.success || !result.username) {
      return NextResponse.json(
        { error: result.error || "Código de verificação incorreto." },
        { status: 401 }
      );
    }

    // Código validado com sucesso! Cria a sessão administrativa oficial
    const token = createSessionToken(result.username);
    const response = NextResponse.json({
      success: true,
      username: result.username
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 // 7 dias
    });

    return response;
  } catch (error) {
    console.error("Erro ao validar 2FA:", error);
    return NextResponse.json(
      { error: "Falha interna ao verificar código de segurança." },
      { status: 500 }
    );
  }
}
