"use client";

import { useState, useEffect } from "react";

export function SecuritySettings() {
  const [currentUsername, setCurrentUsername] = useState("admin");
  const [securityEmail, setSecurityEmail] = useState("entreasilhasturismo@gmail.com");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [hasEmergencyCode, setHasEmergencyCode] = useState(false);
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [activeSmtpHost, setActiveSmtpHost] = useState("");
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);

  // Formulário de Alteração de Credenciais
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newSecurityEmail, setNewSecurityEmail] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Nova chave de emergência revelada após troca de senha
  const [revealedEmergencyCode, setRevealedEmergencyCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Configuração de Servidor SMTP / Gmail / Resend
  const [showSmtpConfig, setShowSmtpConfig] = useState(false);
  const [smtpProvider, setSmtpProvider] = useState<"gmail" | "resend" | "custom">("gmail");
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState(465);
  const [smtpUser, setSmtpUser] = useState("entreasilhasturismo@gmail.com");
  const [smtpPass, setSmtpPass] = useState("");
  const [resendApiKey, setResendApiKey] = useState("");
  const [showSmtpPass, setShowSmtpPass] = useState(false);

  // Dispositivos Confiáveis (2FA por dispositivo)
  interface TrustedDeviceItem {
    id: string;
    label: string;
    createdAt: string;
    lastUsedAt: string;
    userAgent?: string;
  }
  const [trustedDevicesCount, setTrustedDevicesCount] = useState(0);
  const [trustedDevicesList, setTrustedDevicesList] = useState<TrustedDeviceItem[]>([]);
  const [isRevokingDevices, setIsRevokingDevices] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [revokePassword, setRevokePassword] = useState("");

  // Teste de Email
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);

  // Carregar dados de segurança atuais do servidor (apenas dados não-sensíveis)
  useEffect(() => {
    async function loadSecurity() {
      try {
        const res = await fetch("/api/admin/credentials");
        const data = await res.json();
        if (res.ok) {
          setCurrentUsername(data.username || "admin");
          setNewUsername(data.username || "admin");
          setSecurityEmail(data.securityEmail || "entreasilhasturismo@gmail.com");
          setNewSecurityEmail(data.securityEmail || "entreasilhasturismo@gmail.com");
          setTwoFactorEnabled(data.twoFactorEnabled ?? true);
          setHasEmergencyCode(data.hasEmergencyCode ?? false);
          setSmtpConfigured(data.smtpConfigured ?? false);
          setActiveSmtpHost(data.smtpHost || (data.hasResendApiKey ? "Resend API" : ""));
          setTrustedDevicesCount(data.trustedDevicesCount ?? 0);
          setTrustedDevicesList(data.trustedDevices ?? []);
          if (data.smtpHost) setSmtpHost(data.smtpHost);
          if (data.smtpUser) setSmtpUser(data.smtpUser);
        }
      } catch {
        // silencioso
      } finally {
        setIsLoadingInfo(false);
      }
    }
    loadSecurity();
  }, []);

  const handleCopyEmergencyCode = () => {
    if (!revealedEmergencyCode) return;
    navigator.clipboard.writeText(revealedEmergencyCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage("Por favor, digite sua Senha Atual para autorizar as alterações.");
      return;
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        setErrorMessage("A nova senha deve ter no mínimo 8 caracteres.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage("A confirmação de senha não confere com a nova senha digitada.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim() !== currentUsername ? newUsername.trim() : undefined,
          newPassword: newPassword || undefined,
          securityEmail: newSecurityEmail.trim() !== securityEmail ? newSecurityEmail.trim() : undefined,
          twoFactorEnabled
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao salvar alterações de segurança.");
      }

      setSuccessMessage(data.message || "Credenciais atualizadas com sucesso!");
      if (data.username) setCurrentUsername(data.username);
      if (data.securityEmail) setSecurityEmail(data.securityEmail);
      if (data.emergencyRecoveryCode) {
        setRevealedEmergencyCode(data.emergencyRecoveryCode);
        setHasEmergencyCode(true);
      }

      // Limpa os campos de senha
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage("Digite sua Senha Atual para autorizar a configuração de email.");
      return;
    }

    setIsSubmitting(true);

    try {
      let smtpPayload = {};
      if (smtpProvider === "resend") {
        if (!resendApiKey.trim()) {
          throw new Error("Por favor, insira a chave da Resend API (re_...).");
        }
        smtpPayload = {
          resendApiKey: resendApiKey.trim()
        };
      } else {
        if (!smtpHost || !smtpUser || !smtpPass) {
          throw new Error("Preencha o servidor, usuário e a senha de app para configurar o SMTP.");
        }
        smtpPayload = {
          host: smtpHost.trim(),
          port: Number(smtpPort),
          user: smtpUser.trim(),
          pass: smtpPass.trim()
        };
      }

      const res = await fetch("/api/admin/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          securityEmail: "entreasilhasturismo@gmail.com",
          smtp: smtpPayload
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao salvar configurações de email.");
      }

      setSuccessMessage("Servidor de email configurado com sucesso! Agora teste o envio abaixo.");
      setSmtpConfigured(true);
      setActiveSmtpHost(smtpProvider === "resend" ? "Resend API" : smtpHost);
      setSmtpPass("");
      setResendApiKey("");
      setCurrentPassword("");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro ao salvar SMTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    setTestEmailResult(null);
    try {
      const res = await fetch("/api/admin/credentials/test-email", {
        method: "POST"
      });
      const data = await res.json();
      setTestEmailResult({
        success: data.success,
        message: data.message
      });
    } catch (err) {
      setTestEmailResult({
        success: false,
        message: err instanceof Error ? err.message : "Erro desconhecido ao testar envio."
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleRegenerateEmergencyCode = async () => {
    if (!currentPassword) {
      setErrorMessage("Digite sua Senha Atual acima para gerar uma nova Chave de Emergência.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          action: "regenerate-emergency-code"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Falha ao gerar nova chave de emergência.");
      }

      setRevealedEmergencyCode(data.emergencyRecoveryCode);
      setSuccessMessage("Nova Chave de Emergência Master gerada! Guarde-a em local seguro.");
      setHasEmergencyCode(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro ao gerar chave.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeTrustedDevices = async () => {
    if (!revokePassword) {
      setErrorMessage("Por favor, digite sua senha atual para autorizar a revogação de dispositivos.");
      return;
    }

    setIsRevokingDevices(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: revokePassword,
          action: "revoke-trusted-devices"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Falha ao revogar dispositivos.");
      }

      setTrustedDevicesCount(0);
      setTrustedDevicesList([]);
      setShowRevokeConfirm(false);
      setRevokePassword("");
      setSuccessMessage(data.message || "Todos os dispositivos autorizados foram revogados com sucesso!");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro ao revogar dispositivos.");
    } finally {
      setIsRevokingDevices(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Card 1: Alteração de Usuário e Senha */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold mb-2">
            <span>🛡️</span>
            <span>Segurança & Controle de Acesso</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Alterar Usuário e Senha de Acesso
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            As credenciais de administrador são criptografadas com hash salted de alta segurança (PBKDF2 SHA-512) e nunca ficam expostas no código-fonte, tela ou requisições públicas.
          </p>
        </div>

        {/* Alertas */}
        {successMessage && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center gap-2.5 animate-fadeIn">
            <span className="text-base">✅</span>
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-800 flex items-center gap-2.5 animate-fadeIn">
            <span className="text-base">⚠️</span>
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Chave de Emergência Revelada */}
        {revealedEmergencyCode && (
          <div className="rounded-2xl border-2 border-cyan-400 bg-cyan-950 p-5 text-white space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <span>🔑</span> Sua Chave de Recuperação de Emergência
              </span>
              <button
                type="button"
                onClick={handleCopyEmergencyCode}
                className="px-3 py-1 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition flex items-center gap-1"
              >
                <span>{copiedCode ? "✓" : "📋"}</span>
                <span>{copiedCode ? "Copiado!" : "Copiar Chave"}</span>
              </button>
            </div>
            <div className="bg-black/50 p-3 rounded-xl border border-white/10 font-mono text-base font-bold text-cyan-300 text-center tracking-widest selection:bg-cyan-400 selection:text-slate-950">
              {revealedEmergencyCode}
            </div>
            <p className="text-[11px] text-cyan-100/80 leading-relaxed">
              Guarde esta chave em um gerenciador de senhas ou local seguro. Caso não consiga receber o código de 6 dígitos no seu email, você poderá digitar esta chave de emergência diretamente no campo do 2FA para acessar o painel a qualquer momento.
            </p>
          </div>
        )}

        <form onSubmit={handleSaveCredentials} className="space-y-4">
          {/* Usuário Atual & Novo Usuário */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Usuário Atual
              </label>
              <input
                type="text"
                disabled
                value={currentUsername}
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs text-slate-500 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Novo Usuário (Opcional)
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Ex: felipe.admin"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-brand-sea focus:outline-none"
              />
            </div>
          </div>

          {/* Nova Senha & Confirmação */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nova Senha (Mínimo 8 caracteres)
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Deixe em branco se não desejar alterar"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-brand-sea focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-brand-sea focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
          </div>

          {/* Senha Atual Obrigatória */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Senha Atual <span className="text-rose-500">* (Obrigatória para confirmar qualquer alteração)</span>
            </label>
            <div className="relative max-w-md">
              <input
                type={showCurrentPassword ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-brand-sea focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                {showCurrentPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !currentPassword}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold px-6 py-2.5 text-xs shadow-sm transition hover:scale-[1.01] active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Salvando com segurança...</span>
                </>
              ) : (
                <>
                  <span>Salvar Alterações de Acesso</span>
                  <span>🔒</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Card 2: Autenticação em Duas Etapas (2FA) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <span>🔐</span>
            <span>Duplo Fator de Autenticação (2FA)</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Verificação em Duas Etapas (2FA) & Recuperação
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Protege o acesso administrativo mesmo se um invasor descobrir a senha. Ao fazer login, um código numérico temporário de 6 dígitos é exigido.
          </p>
        </div>

        <div className="space-y-4">
          {/* Status do 2FA */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Status da Verificação em Duas Etapas
              </span>
              <span className="text-[11px] text-slate-500">
                {twoFactorEnabled
                  ? "Ativada: exige código de 6 dígitos (ou Chave de Emergência) no login."
                  : "Desativada: login direto com usuário e senha."}
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Email Principal de Segurança */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Principal de Segurança & 2FA
            </label>
            <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
              <input
                type="email"
                value={newSecurityEmail}
                onChange={(e) => setNewSecurityEmail(e.target.value)}
                placeholder="entreasilhasturismo@gmail.com"
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-brand-sea focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleTestEmail}
                disabled={isTestingEmail}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition shrink-0"
              >
                <span>{isTestingEmail ? "Testando..." : "Testar Envio"}</span>
                <span>📧</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Destinatário oficial para recebimento dos códigos OTP de acesso e recuperação de conta.
            </p>
            {testEmailResult && (
              <div
                className={`text-xs p-3 rounded-xl mt-2 border ${
                  testEmailResult.success
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-900 border-amber-200"
                }`}
              >
                {testEmailResult.message}
              </div>
            )}
          </div>

          {/* Status do Servidor de Email de Saída */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <span>📬</span> Servidor de Saída de Email (SMTP / Gmail / Resend)
                </span>
                <span className="text-[11px] text-slate-600">
                  Status atual:{" "}
                  {smtpConfigured ? (
                    <strong className="text-emerald-700 font-bold">
                      Conectado ({activeSmtpHost || "SMTP Ativo"})
                    </strong>
                  ) : (
                    <strong className="text-amber-700 font-bold">
                      Não configurado (os códigos ficam gravados nos logs do Portainer)
                    </strong>
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSmtpConfig(!showSmtpConfig)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-sm transition self-start sm:self-center"
              >
                <span>{showSmtpConfig ? "Ocultar Configuração" : "Configurar SMTP / Gmail"}</span>
                <span>⚙️</span>
              </button>
            </div>

            {/* Formulário Retrátil de Configuração SMTP */}
            {showSmtpConfig && (
              <form onSubmit={handleSaveSmtp} className="mt-3 pt-3 border-t border-slate-200 space-y-4">
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button
                    type="button"
                    onClick={() => setSmtpProvider("gmail")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      smtpProvider === "gmail"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    Gmail (SMTP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmtpProvider("resend")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      smtpProvider === "resend"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    Resend API
                  </button>
                </div>

                {smtpProvider === "gmail" ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 text-xs text-cyan-900 space-y-1">
                      <p className="font-bold flex items-center gap-1">
                        <span>💡</span> Como usar o Gmail gratuitamente:
                      </p>
                      <p className="text-[11px] leading-relaxed">
                        1. Acesse sua Conta Google em <strong>myaccount.google.com/apppasswords</strong>.<br />
                        2. Crie uma <strong>Senha de App</strong> com o nome &ldquo;Entre as Ilhas&rdquo;.<br />
                        3. Cole o código de 16 letras gerado no campo de senha abaixo.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Servidor SMTP
                        </label>
                        <input
                          type="text"
                          value={smtpHost}
                          onChange={(e) => setSmtpHost(e.target.value)}
                          placeholder="smtp.gmail.com"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Porta SSL
                        </label>
                        <input
                          type="number"
                          value={smtpPort}
                          onChange={(e) => setSmtpPort(Number(e.target.value))}
                          placeholder="465"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email da Conta Gmail (Usuário SMTP)
                      </label>
                      <input
                        type="email"
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        placeholder="entreasilhasturismo@gmail.com"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Senha de App do Google (16 caracteres)
                      </label>
                      <div className="relative">
                        <input
                          type={showSmtpPass ? "text" : "password"}
                          value={smtpPass}
                          onChange={(e) => setSmtpPass(e.target.value)}
                          placeholder="Ex: abcd efgh ijkl mnop"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSmtpPass(!showSmtpPass)}
                          className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
                        >
                          {showSmtpPass ? "👁️" : "🙈"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600">
                      Crie uma conta gratuita em <strong>resend.com</strong> e gere uma API Key (100 emails/dia grátis sem configuração de servidor):
                    </p>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Resend API Key
                      </label>
                      <input
                        type="password"
                        value={resendApiKey}
                        onChange={(e) => setResendApiKey(e.target.value)}
                        placeholder="re_123456789..."
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Confirme sua Senha Atual de Administrador
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Sua senha atual para autorizar"
                    className="w-full max-w-sm rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !currentPassword}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
                >
                  Salvar Servidor de Email
                </button>
              </form>
            )}
          </div>

          {/* Chave de Recuperação de Emergência */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <span>🔑</span> Chave de Emergência Master
                </span>
                <span className="text-[11px] text-slate-500">
                  {hasEmergencyCode
                    ? "Uma chave de emergência está ativa no sistema."
                    : "Nenhuma chave gerada ainda."}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRegenerateEmergencyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-sm transition self-start sm:self-center"
              >
                <span>Gerar Nova Chave</span>
                <span>⚡</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              A chave de emergência é um código mestre que permite acesso imediato ao painel mesmo se sua caixa de email estiver temporariamente inacessível ou sem SMTP conectado.
            </p>
          </div>
        </div>
      </div>

      {/* Card 3: Dispositivos Confiáveis (2FA por Dispositivo) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold mb-2">
              <span>💻📱</span>
              <span>Dispositivos Confiáveis & Navegadores</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Dispositivos Confiáveis (2FA Apenas no 1º Acesso)
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              O código 2FA de 6 dígitos é solicitado <strong>apenas na primeira vez</strong> em que você acessa de um computador, celular ou navegador diferente. Uma vez verificado com sucesso, aquele aparelho é lembrado com segurança por <strong>90 dias</strong>, dispensando o código a cada novo login.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              {trustedDevicesCount} ativo{trustedDevicesCount === 1 ? "" : "s"}
            </span>
            {trustedDevicesCount > 0 && !showRevokeConfirm && (
              <button
                type="button"
                onClick={() => setShowRevokeConfirm(true)}
                className="px-3 py-1 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition"
              >
                Revogar Todos
              </button>
            )}
          </div>
        </div>

        {/* Modal/Formulário de Confirmação de Revogação */}
        {showRevokeConfirm && (
          <div className="rounded-2xl border border-rose-300 bg-rose-50/70 p-5 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
              <span className="text-base">⚠️</span>
              <span>Revogar todos os dispositivos autorizados?</span>
            </div>
            <p className="text-xs text-rose-800/90 leading-relaxed">
              Essa ação cancelará a autorização de todos os computadores e celulares conectados. No próximo acesso de qualquer navegador, o código de 6 dígitos enviado por e-mail será obrigatoriamente exigido.
            </p>
            <div className="space-y-2 max-w-md">
              <label className="block text-[11px] font-bold text-slate-800 uppercase">
                Digite sua senha atual de administrador para confirmar:
              </label>
              <input
                type="password"
                required
                value={revokePassword}
                onChange={(e) => setRevokePassword(e.target.value)}
                placeholder="Sua senha atual"
                className="w-full rounded-xl border border-rose-300 bg-white px-3 py-2 text-xs text-slate-900"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleRevokeTrustedDevices}
                disabled={isRevokingDevices || !revokePassword}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs transition"
              >
                {isRevokingDevices ? "Revogando..." : "Confirmar e Revogar Todos"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRevokeConfirm(false);
                  setRevokePassword("");
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Dispositivos Confiáveis */}
        {trustedDevicesList.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Dispositivo / Navegador</th>
                  <th className="px-4 py-3">Autorizado em</th>
                  <th className="px-4 py-3">Último Acesso</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trustedDevicesList.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>🖥️</span>
                        <span>{dev.label || "Navegador Autorizado"}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ID: {dev.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(dev.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(dev.lastUsedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Confiável (90d)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center space-y-1.5">
            <span className="text-2xl block">🌐</span>
            <p className="text-xs font-semibold text-slate-800">
              Nenhum dispositivo registrado na lista de confiança ainda
            </p>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              Ao digitar o código 2FA no seu próximo login, este computador/navegador será automaticamente reconhecido e lembrado por 90 dias.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
