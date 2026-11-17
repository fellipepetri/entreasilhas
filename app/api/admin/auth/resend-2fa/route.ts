import { NextResponse } from "next/server";
import { createTwoFactorChallenge, getSecurityConfig } from "@/lib/admin-security";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    const config = getSecurityConfig();
    const targetUser = username?.trim() || config.username;

    const challenge = await createTwoFactorChallenge(targetUser);

    return NextResponse.json({
      success: true,
      tempToken: challenge.tempToken,
      maskedEmail: challenge.maskedEmail,
      expiresInSeconds: challenge.expiresInSeconds,
      message: "Novo código enviado com sucesso."
    });
  } catch (error) {
    console.error("Erro ao reenviar código 2FA:", error);
    return NextResponse.json(
      { error: "Falha ao reenviar código." },
      { status: 500 }
    );
  }
}
