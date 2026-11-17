"use client";

import { useState, useEffect } from "react";

export function SecuritySettings() {
  const [currentUsername, setCurrentUsername] = useState("admin");
  const [securityEmail, setSecurityEmail] = useState("contato.felipepetri@gmail.com");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [hasEmergencyCode, setHasEmergencyCode] = useState(false);
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

  // Teste de Email
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<string | null>(null);

  // Carregar dados de segurança atuais do servidor (apenas dados não-sensíveis)
  useEffect(() => {
    async function loadSecurity() {
      try {
        const res = await fetch("/api/admin/credentials");
        const data = await res.json();
        if (res.ok) {
          setCurrentUsername(data.username || "admin");
          setNewUsername(data.username || "admin");
          setSecurityEmail(data.securityEmail || "contato.felipepetri@gmail.com");
          setNewSecurityEmail(data.securityEmail || "contato.felipepetri@gmail.com");
          setTwoFactorEnabled(data.twoFactorEnabled ?? true);
          setHasEmergencyCode(data.hasEmergencyCode ?? false);
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

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    setTestEmailResult(null);
    try {
      const res = await fetch("/api/admin/credentials/test-email", {
        method: "POST"
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Falha no envio do teste.");
      }
      setTestEmailResult(`✅ ${data.message}`);
    } catch (err) {
      setTestEmailResult(`⚠️ ${err instanceof Error ? err.message : "Erro no envio."}`);
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
              Guarde esta chave em um gerenciador de senhas ou local seguro. Caso não consiga receber o código de 6 dígitos no seu email, você poderá usar esta chave de emergência para acessar o painel a qualquer momento.
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
            Protege o acesso administrativo mesmo se um invasor descobrir ou tentar adivinhar a senha. Ao fazer login, um código numérico temporário de 6 dígitos é exigido.
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
                  ? "Ativada: exige código de 6 dígitos no login do painel."
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
                placeholder="contato.felipepetri@gmail.com"
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-brand-sea focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleTestEmail}
                disabled={isTestingEmail}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition shrink-0"
              >
                <span>{isTestingEmail ? "Enviando..." : "Testar Envio"}</span>
                <span>📧</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Destinatário oficial para recebimento dos códigos OTP de acesso e recuperação de conta.
            </p>
            {testEmailResult && (
              <p className="text-xs font-medium mt-1.5 text-slate-700">
                {testEmailResult}
              </p>
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
              A chave de emergência é um código mestre que permite acesso imediato ao painel mesmo se sua caixa de email estiver temporariamente inacessível.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
