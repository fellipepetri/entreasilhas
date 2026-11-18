import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/admin-auth";
import {
  getSecurityConfig,
  updateAdminSecurity,
  regenerateEmergencyCode,
  revokeAllTrustedDevices,
  getTrustedDevicesSummary,
  verifyAdminPassword
} from "@/lib/admin-security";

export async function GET(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const config = getSecurityConfig();

  const smtpConfigured = Boolean(
    config.smtp?.resendApiKey ||
    process.env.RESEND_API_KEY ||
    (config.smtp?.host && config.smtp?.user && config.smtp?.pass) ||
    (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  );

  const trustedDevicesInfo = getTrustedDevicesSummary();

  return NextResponse.json({
    username: config.username,
    securityEmail: config.securityEmail,
    twoFactorEnabled: config.twoFactorEnabled,
    hasEmergencyCode: Boolean(config.emergencyRecoveryCode),
    smtpConfigured,
    smtpHost: config.smtp?.host || process.env.SMTP_HOST || "",
    smtpUser: config.smtp?.user || process.env.SMTP_USER || "",
    hasResendApiKey: Boolean(config.smtp?.resendApiKey || process.env.RESEND_API_KEY),
    trustedDevicesCount: trustedDevicesInfo.count,
    trustedDevices: trustedDevicesInfo.devices,
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

    if (action === "revoke-trusted-devices") {
      if (!verifyAdminPassword(currentPassword)) {
        return NextResponse.json(
          { error: "A senha atual informada está incorreta." },
          { status: 400 }
        );
      }
      revokeAllTrustedDevices();
      return NextResponse.json({
        success: true,
        message: "Todos os dispositivos autorizados foram revogados com sucesso. No próximo acesso de qualquer navegador, o código 2FA será solicitado.",
        trustedDevicesCount: 0,
        trustedDevices: []
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
