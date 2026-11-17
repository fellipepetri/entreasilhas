"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface AdminLoginProps {
  onSuccess: (username: string) => void;
  title?: string;
  subtitle?: string;
  badgeText?: string;
}

export function AdminLogin({
  onSuccess,
  title = "Painel de Administração",
  subtitle = "Entre as Ilhas — Gestão de Conteúdos",
  badgeText = "Acesso Restrito & Protegido"
}: AdminLoginProps) {
  // Etapa 1: Credenciais (usuário e senha) | Etapa 2: Código 2FA
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");

  // Credenciais
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 2FA
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState<string>("contato.felipepetri@gmail.com");
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // Foco automático no campo OTP ao entrar na etapa 2
  useEffect(() => {
    if (step === "2fa" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Timer regressivo do reenvio de código
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Etapa 1: Envio de Usuário e Senha
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Por favor, preencha o usuário e a senha.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Credenciais inválidas. Verifique seu usuário e senha.");
      }

      // Se exigir 2FA, avança para a etapa do código de segurança
      if (data.requires2FA) {
        setTempToken(data.tempToken);
        setMaskedEmail(data.maskedEmail || "contato.felipepetri@gmail.com");
        setStep("2fa");
        setResendCooldown(60);
        setInfoMessage(`Código de verificação de 6 dígitos enviado para ${data.maskedEmail}.`);
        return;
      }

      // Login direto se 2FA estiver desativado
      onSuccess(data.username);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao efetuar login."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Etapa 2: Validação do Código 2FA ou Chave de Emergência
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || !tempToken) {
      setErrorMessage("Por favor, digite o código de 6 dígitos recebido.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tempToken,
          code: otpCode.trim()
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Código de verificação incorreto ou expirado.");
      }

      onSuccess(data.username);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao validar o código."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar código OTP
  const handleResendCode = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const res = await fetch("/api/admin/auth/resend-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Falha ao reenviar código.");
      }

      setTempToken(data.tempToken);
      setResendCooldown(60);
      setInfoMessage("Novo código enviado com sucesso para seu email!");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erro ao reenviar.");
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToCredentials = () => {
    setStep("credentials");
    setOtpCode("");
    setErrorMessage(null);
    setInfoMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-deep via-slate-900 to-brand-deep text-white">
      <div className="w-full max-w-md">
        {/* Card do Formulário de Acesso */}
        <div className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          {/* Topo com Logo e Identificação */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 p-2 mb-4 shadow-inner">
              <Image
                src="/images/logoeai.png"
                alt="Entre as Ilhas"
                width={52}
                height={52}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-1 text-sm text-cyan-200/80">
              {subtitle}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[11px] font-semibold text-cyan-300">
              <span>{step === "credentials" ? "🔒" : "🔐"}</span>
              <span>{step === "credentials" ? badgeText : "Duplo Fator de Autenticação Ativo"}</span>
            </div>
          </div>

          {/* Alertas */}
          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/20 p-3.5 text-xs text-rose-200 flex items-start gap-2.5 animate-shake">
              <span className="text-base leading-none">⚠️</span>
              <p className="flex-1 font-medium">{errorMessage}</p>
            </div>
          )}

          {infoMessage && (
            <div className="mb-6 rounded-2xl border border-cyan-400/30 bg-cyan-500/15 p-3.5 text-xs text-cyan-200 flex items-start gap-2.5 animate-fadeIn">
              <span className="text-base leading-none">ℹ️</span>
              <p className="flex-1 font-medium">{infoMessage}</p>
            </div>
          )}

          {/* ETAPA 1: USUÁRIO E SENHA */}
          {step === "credentials" ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-username"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Usuário de Administrador
                </label>
                <div className="relative">
                  <input
                    id="admin-username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: admin"
                    className="w-full rounded-2xl border border-white/20 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition"
                  />
                  <span className="absolute right-4 top-3.5 text-slate-400 text-sm">
                    👤
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-2xl border border-white/20 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-white p-1 transition"
                    aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 hover:from-cyan-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-bold py-3.5 px-6 text-sm shadow-xl transition hover:scale-[1.02] active:scale-[0.99] mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    <span>Verificando credenciais...</span>
                  </>
                ) : (
                  <>
                    <span>Continuar</span>
                    <span>➔</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ETAPA 2: VERIFICAÇÃO EM DUAS ETAPAS (2FA) */
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="text-center space-y-2">
                <span className="text-3xl block">📨</span>
                <h3 className="text-base font-bold text-white">
                  Código de Verificação (2FA)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Digite o código numérico de 6 dígitos que enviamos para o seu email de segurança:
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
                  {maskedEmail}
                </div>
              </div>

              <div>
                <input
                  ref={otpInputRef}
                  type="text"
                  inputMode="text"
                  autoComplete="one-time-code"
                  maxLength={18}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.toUpperCase())}
                  placeholder="000000"
                  className="w-full rounded-2xl border-2 border-cyan-400/40 bg-black/40 px-4 py-3.5 text-center text-2xl font-mono font-bold text-cyan-300 placeholder:text-slate-600 tracking-[0.3em] focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/20 transition uppercase"
                />
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Ou digite sua Chave de Emergência (EAI-XXXX-XXXX)
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !otpCode.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 hover:from-cyan-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-bold py-3.5 px-6 text-sm shadow-xl transition hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    <span>Autenticando sessão...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar Código & Entrar</span>
                    <span>🔓</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={handleBackToCredentials}
                  className="text-slate-400 hover:text-white transition"
                >
                  ← Trocar usuário
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0 || isResending}
                  onClick={handleResendCode}
                  className="text-cyan-300 hover:underline disabled:opacity-50 disabled:no-underline font-semibold"
                >
                  {resendCooldown > 0
                    ? `Reenviar em ${resendCooldown}s`
                    : isResending
                    ? "Enviando..."
                    : "Reenviar código"}
                </button>
              </div>
            </form>
          )}

          {/* Rodapé do Login */}
          <div className="mt-8 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Não é administrador?{" "}
              <Link
                href="/"
                className="text-cyan-300 font-semibold hover:underline"
              >
                Voltar para o site principal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
