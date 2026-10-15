"use client";

import Image from "next/image";

interface AdminHeaderProps {
  username: string;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onLogout: () => void;
  lastSavedAt?: string | null;
}

export function AdminHeader({
  username,
  isSaving,
  hasUnsavedChanges,
  onSave,
  onLogout,
  lastSavedAt
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Identificação da Marca */}
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-slate-900 p-1 border border-slate-800">
            <Image
              src="/images/logoeai.png"
              alt="Entre as Ilhas"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              Entre as Ilhas
            </h1>
            <p className="text-[11px] text-cyan-700 font-semibold leading-none">
              Painel de Administração
            </p>
          </div>
        </div>

        {/* Status de Salvamento e Botões de Ação */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {lastSavedAt && (
            <span className="hidden md:inline-block text-[11px] text-slate-400">
              Salvo às {lastSavedAt}
            </span>
          )}

          {/* Botão de Salvar Alterações */}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className={[
              "inline-flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2 text-xs font-bold transition shadow-sm",
              hasUnsavedChanges
                ? "bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse shadow-emerald-500/30 shadow-md ring-2 ring-emerald-400"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            ].join(" ")}
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Salvando...</span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <span>Salvar Alterações</span>
                <span>✨</span>
              </>
            ) : (
              <>
                <span>Salvar</span>
                <span>💾</span>
              </>
            )}
          </button>

          {/* Link para o Site Público */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 text-xs font-semibold transition"
          >
            <span>Ver Site</span>
            <span>↗</span>
          </a>

          {/* Usuário e Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {username}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 px-2.5 py-1.5 text-xs font-medium transition"
              title="Encerrar sessão administrativa"
            >
              <span>Sair</span>
              <span>🚪</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
