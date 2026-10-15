"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface AdminLoginProps {
  onSuccess: (username: string) => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Por favor, preencha o usuário e a senha.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

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

      onSuccess(data.username);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao efetuar login."
      );
    } finally {
      setIsLoading(false);
    }
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
              Painel de Administração
            </h1>
            <p className="mt-1 text-sm text-cyan-200/80">
              Entre as Ilhas — Gestão de Conteúdos
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[11px] font-semibold text-cyan-300">
              <span>🔒</span>
              <span>Acesso Restrito & Protegido</span>
            </div>
          </div>

          {/* Alerta de Erro */}
          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/20 p-3.5 text-xs text-rose-200 flex items-start gap-2.5 animate-shake">
              <span className="text-base leading-none">⚠️</span>
              <p className="flex-1">{errorMessage}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 hover:from-cyan-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-bold py-3.5 px-6 text-sm shadow-xl transition hover:scale-[1.02] active:scale-[0.99] mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Verificando credenciais...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <span>➔</span>
                </>
              )}
            </button>
          </form>

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
