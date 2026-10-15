"use client";

import Image from "next/image";
import Link from "next/link";

interface AgendaHeaderProps {
  onLogout: () => void;
  onOpenNewBookingModal: () => void;
  currentUserName: string;
}

export function AgendaHeader({
  onLogout,
  onOpenNewBookingModal,
  currentUserName
}: AgendaHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        {/* Identificação */}
        <div className="flex items-center gap-3.5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 transition opacity-90 hover:opacity-100"
            title="Abrir o site público"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 p-1.5 border border-white/20 shadow-inner">
              <Image
                src="/images/logoeai.png"
                alt="Entre as Ilhas"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>Painel de Reservas & Agenda</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Agendamentos
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Entre as Ilhas — Gestão de Charters, Calendário e Financeiro
            </p>
          </div>
        </div>

        {/* Ações do Topo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão Nova Reserva */}
          <button
            type="button"
            onClick={onOpenNewBookingModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#16c2c0,#1498d5)] px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-md transition hover:brightness-105 active:scale-95 cursor-pointer"
          >
            <span className="text-base leading-none">＋</span>
            <span className="hidden sm:inline">Nova Reserva</span>
            <span className="sm:hidden">Reserva</span>
          </button>

          {/* Atalho para Painel de Conteúdo */}
          <Link
            href="/admin-painel"
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            title="Ir para o painel de edição do site"
          >
            <span>📝</span>
            <span>Editar Conteúdo</span>
          </Link>

          {/* Atalho Ver Site */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span>Site</span>
            <span>↗</span>
          </Link>

          {/* Usuário & Sair */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <span className="hidden xl:inline-block text-xs text-slate-400 font-medium">
              Olá, <strong className="text-slate-200">{currentUserName}</strong>
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500 hover:text-white active:scale-95 cursor-pointer"
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
