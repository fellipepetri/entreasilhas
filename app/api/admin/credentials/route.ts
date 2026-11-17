import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/admin-auth";
import {
  getSecurityConfig,
  updateAdminSecurity,
  regenerateEmergencyCode
} from "@/lib/admin-security";

export async function GET(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const config = getSecurityConfig();

  // Retorna informações seguras SEM NUNCA expor senhas ou segredos
  return NextResponse.json({
    username: config.username,
    securityEmail: config.securityEmail,
    twoFactorEnabled: config.twoFactorEnabled,
    hasEmergencyCode: Boolean(config.emergencyRecoveryCode),
    smtpConfigured: Boolean(config.smtp?.resendApiKey || config.smtp?.host),
    updatedAt: config.updatedAt
  });
}

export async function POST(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      currentPassword,
      newUsername,
      newPassword,
      securityEmail,
      twoFactorEnabled,
      smtp,
      action
    } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { error: "A senha atual é obrigatória para autorizar qualquer alteração." },
        { status: 400 }
      );
    }

    if (action === "regenerate-emergency-code") {
      const res = regenerateEmergencyCode(currentPassword);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        emergencyRecoveryCode: res.emergencyRecoveryCode,
        message: "Nova Chave de Emergência gerada com sucesso! Guarde-a em local seguro."
      });
    }

    const result = updateAdminSecurity(currentPassword, {
      newUsername,
      newPassword,
      securityEmail,
      twoFactorEnabled,
      smtp
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Configurações de segurança e credenciais atualizadas com sucesso!",
      username: result.username,
      securityEmail: result.securityEmail,
      twoFactorEnabled: result.twoFactorEnabled,
      emergencyRecoveryCode: result.emergencyRecoveryCode
    });
  } catch (error) {
    console.error("Erro ao atualizar credenciais:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar configurações de segurança." },
      { status: 500 }
    );
  }
}
