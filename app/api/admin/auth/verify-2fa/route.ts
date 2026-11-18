import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  TRUSTED_DEVICE_COOKIE,
  TRUSTED_DEVICE_MAX_AGE,
  createSessionToken,
  registerTrustedDevice
} from "@/lib/admin-auth";
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

    // Registra este dispositivo como confiável para não solicitar 2FA novamente pelos próximos 90 dias
    const userAgent = request.headers.get("user-agent") || undefined;
    const { token: trustedDeviceToken } = registerTrustedDevice(result.username, userAgent);

    const response = NextResponse.json({
      success: true,
      username: result.username,
      trustedDeviceRegistered: true
    });

    // Cookie de Sessão Admin (7 dias)
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 // 7 dias
    });

    // Cookie de Dispositivo Confiável (90 dias)
    response.cookies.set({
      name: TRUSTED_DEVICE_COOKIE,
      value: trustedDeviceToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TRUSTED_DEVICE_MAX_AGE
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
