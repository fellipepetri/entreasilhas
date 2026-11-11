"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PwaTopBanner } from "@/components/pwa-top-banner";
import type { SiteFeatures } from "@/lib/content-types";

export interface TabItem {
  id: string;
  label: string;
  icon: string;
}

interface AdminHeaderProps {
  username: string;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onLogout: () => void;
  lastSavedAt?: string | null;
  isMaintenanceEnabled?: boolean;
  onNavigateTab?: (tabId: string) => void;
  tabs?: readonly TabItem[];
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
  features?: SiteFeatures;
  tabFeatureMap?: Partial<Record<string, keyof SiteFeatures>>;
}

export function AdminHeader({
  username,
  isSaving,
  hasUnsavedChanges,
  onSave,
  onLogout,
  lastSavedAt,
  isMaintenanceEnabled,
  onNavigateTab,
  tabs,
  activeTab,
  onSelectTab,
  features,
  tabFeatureMap
}: AdminHeaderProps) {
  const [isSectionsMenuOpen, setIsSectionsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o submenu ao clicar fora ou pressionar a tecla Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsSectionsMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsSectionsMenuOpen(false);
      }
    }

    if (isSectionsMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSectionsMenuOpen]);

  const activeTabItem = tabs?.find((t) => t.id === activeTab);

  return (
    <>
      {/* Banner / Card flutuante que desce do topo */}
      <PwaTopBanner />

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
          <div className="flex items-center gap-2 sm:gap-3">
            {isMaintenanceEnabled && (
              <button
                type="button"
                onClick={() => {
                  if (onSelectTab) onSelectTab("settings");
                  else onNavigateTab?.("settings");
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-400 bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 px-3 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer"
                title="O Modo Em Construção está ativo no site. Clique para gerenciar."
              >
                <span>🚧</span>
                <span className="hidden sm:inline">Em Construção</span>
                <span className="uppercase text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-md font-extrabold">
                  Ativo
                </span>
              </button>
            )}

            {lastSavedAt && (
              <span className="hidden lg:inline-block text-[11px] text-slate-400">
                Salvo às {lastSavedAt}
              </span>
            )}

            {/* Botão de Salvar Alterações */}
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-3.5 sm:px-4 py-2 text-xs font-bold transition shadow-sm cursor-pointer",
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

            {/* Submenu Vertical de Seções (ao lado direito de Salvar) */}
            {tabs && tabs.length > 0 && onSelectTab && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsSectionsMenuOpen((prev) => !prev)}
                  className={[
                    "inline-flex items-center gap-2 rounded-xl px-3 sm:px-3.5 py-2 text-xs font-bold transition shadow-xs border cursor-pointer",
                    isSectionsMenuOpen
                      ? "border-brand-deep bg-brand-deep text-white shadow-sm ring-2 ring-brand-deep/20"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-800 hover:border-slate-400"
                  ].join(" ")}
                  title="Clique para escolher a seção do site para editar"
                  aria-expanded={isSectionsMenuOpen}
                >
                  <span className="text-sm">📑</span>
                  <span className="flex items-center gap-1.5">
                    <span>Seções</span>
                    {activeTabItem && (
                      <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold opacity-90 border-l border-current/25 pl-1.5">
                        <span>{activeTabItem.icon}</span>
                        <span className="max-w-[125px] truncate">{activeTabItem.label}</span>
                      </span>
                    )}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isSectionsMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Backdrop no mobile para fechar facilmente ao tocar fora */}
                {isSectionsMenuOpen && (
                  <div
                    className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-xs sm:hidden"
                    onClick={() => setIsSectionsMenuOpen(false)}
                    aria-hidden="true"
                  />
                )}

                {/* Dropdown com Lista Vertical e Barra de Rolagem */}
                {isSectionsMenuOpen && (
                  <div
                    className="fixed sm:absolute inset-x-4 sm:inset-x-auto sm:right-0 top-16 sm:top-full mt-2 w-auto sm:w-80 rounded-2xl border border-slate-300/90 bg-slate-100 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      backgroundColor: "#f1f5f9",
                      boxShadow:
                        "0 20px 45px -10px rgba(15, 23, 42, 0.22), 0 8px 16px -6px rgba(15, 23, 42, 0.12)"
                    }}
                  >
                    {/* Cabeçalho do Submenu */}
                    <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">📂</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Seções do Site
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                        {tabs.length} seções
                      </span>
                    </div>

                    {/* Lista Vertical de Seções com Rolagem Customizada */}
                    <div className="max-h-[min(380px,65vh)] overflow-y-auto py-1.5 space-y-1 custom-scrollbar pr-1">
                      {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const mappedFeature = tabFeatureMap?.[tab.id];
                        const isFeatureDisabled =
                          mappedFeature && features?.[mappedFeature] === false;

                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                              onSelectTab(tab.id);
                              setIsSectionsMenuOpen(false);
                            }}
                            className={[
                              "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition cursor-pointer group",
                              isActive
                                ? "bg-brand-deep text-white shadow-sm"
                                : "text-slate-700 hover:bg-white hover:text-slate-950 hover:shadow-xs",
                              isFeatureDisabled && !isActive ? "opacity-75" : ""
                            ].join(" ")}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-base shrink-0">{tab.icon}</span>
                              <span className="truncate">{tab.label}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {isFeatureDisabled && (
                                <span
                                  className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-extrabold ${
                                    isActive
                                      ? "bg-amber-400 text-slate-950"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  Oculto
                                </span>
                              )}
                              {isActive ? (
                                <span className="text-xs font-bold text-cyan-300">✓</span>
                              ) : (
                                <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition">
                                  →
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Atalho para Painel de Agendamentos */}
            <Link
              href="/agenda-painel"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs font-semibold transition hover:border-slate-400"
              title="Ir para o painel de reservas e agendamentos"
            >
              <span>📅</span>
              <span>Agendamentos</span>
            </Link>

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
                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 px-2.5 py-1.5 text-xs font-medium transition cursor-pointer"
                title="Encerrar sessão administrativa"
              >
                <span>Sair</span>
                <span>🚪</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
