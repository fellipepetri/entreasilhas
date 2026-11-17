import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  getAdminCredentials,
  isRequestAuthenticated
} from "@/lib/admin-auth";
import {
  getSecurityConfig,
  verifyAdminLogin,
  createTwoFactorChallenge
} from "@/lib/admin-security";

export async function GET(request: Request) {
  const authenticated = isRequestAuthenticated(request);
  const { username } = getAdminCredentials();

  return NextResponse.json({
    authenticated,
    username: authenticated ? username : null
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Por favor, preencha o usuário e a senha." },
        { status: 400 }
      );
    }

    const isValid = verifyAdminLogin(username, password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos." },
        { status: 401 }
      );
    }

    const config = getSecurityConfig();

    // Se 2FA estiver ativado, gera o desafio e solicita o código de 6 dígitos
    if (config.twoFactorEnabled) {
      const challenge = await createTwoFactorChallenge(username);
      return NextResponse.json({
        success: true,
        requires2FA: true,
        tempToken: challenge.tempToken,
        maskedEmail: challenge.maskedEmail,
        expiresInSeconds: challenge.expiresInSeconds,
        username
      });
    }

    // Se 2FA estiver desativado, efetua login direto
    const token = createSessionToken(username);
    const response = NextResponse.json({
      success: true,
      username
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
    console.error("Erro na autenticação admin:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar login." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  return response;
}
