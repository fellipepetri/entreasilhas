"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { PwaInstallModal } from "@/components/pwa-install-modal";

export function PwaTopBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Não exibir se o usuário já estiver dentro do PWA instalado (Standalone)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // 2. Capturar evento de instalação nativo no Android/Chrome
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // 3. Efeito de subir suavemente do canto inferior direito ao carregar
    setIsRendered(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 450);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  // Fecha a caixa retangular ao clicar fora ou pressionar Escape
  useEffect(() => {
    if (!isBoxOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsBoxOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsBoxOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isBoxOpen]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsBoxOpen(false);
        setIsVisible(false);
        setDeferredPrompt(null);
        return;
      }
    }
    // Caso seja iOS ou não tenha disparado beforeinstallprompt, abre o modal instrutivo
    setIsModalOpen(true);
  };

  if (!isRendered) return null;

  return (
    <>
      {/* Contêiner Flutuante no Canto Inferior Direito */}
      <div
        ref={containerRef}
        aria-label="Instalação do Aplicativo"
        className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 transition-all duration-500 ease-out transform ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-16 opacity-0 scale-75 pointer-events-none"
        }`}
      >
        {/* Caixa Retangular que se abre ao clicar no botão circular */}
        {isBoxOpen && (
          <div
            className="absolute bottom-16 sm:bottom-18 right-0 mb-1 w-[calc(100vw-2.5rem)] max-w-sm sm:w-96 rounded-2xl border border-white/20 bg-[#182232]/98 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl ring-1 ring-black/40 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200"
          >
            {/* Topo da caixa: Ícone, Textos e Botão Fechar */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#16c2c0]/30 to-[#1498d5]/30 p-1.5 border border-white/20 shadow-md">
                  <Image
                    src="/icons/icon-192x192.png"
                    alt="Entre as Ilhas"
                    width={36}
                    height={36}
                    className="object-contain rounded-lg"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-white tracking-tight leading-snug">
                    Instale o app Entre as Ilhas
                  </p>
                  <p className="text-xs text-slate-300 leading-tight mt-0.5">
                    Acesse mais rápido direto da sua tela inicial
                  </p>
                </div>
              </div>

              {/* Botão de Fechar a caixa */}
              <button
                type="button"
                onClick={() => setIsBoxOpen(false)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer text-xs"
                title="Fechar caixa"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            {/* Rodapé da caixa: Botão Instalar app + nota de compatibilidade */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-medium">
                Android, iOS e Desktop
              </span>
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#16c2c0] to-[#1498d5] hover:brightness-110 px-4 py-2 text-xs font-bold text-white shadow-md transition active:scale-95 cursor-pointer"
              >
                <span>Instalar app</span>
                <span>📲</span>
              </button>
            </div>
          </div>
        )}

        {/* Botão Circular Flutuante com Ponto de Interrogação */}
        <button
          type="button"
          onClick={() => setIsBoxOpen((prev) => !prev)}
          className={`flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-gradient-to-tr from-slate-950 via-[#163a70] to-[#1498d5] text-white border-2 border-white/30 shadow-[0_10px_30px_rgba(20,152,213,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isBoxOpen
              ? "ring-4 ring-cyan-400/40"
              : "hover:shadow-[0_12px_35px_rgba(20,152,213,0.6)]"
          }`}
          title={isBoxOpen ? "Fechar ajuda" : "Instalar aplicativo Entre as Ilhas"}
          aria-expanded={isBoxOpen}
          aria-label="Ajuda e instalação do aplicativo Entre as Ilhas"
        >
          {isBoxOpen ? (
            <span className="text-base font-bold transition-transform duration-200">
              ✕
            </span>
          ) : (
            <span className="text-xl font-black tracking-tight leading-none">
              ?
            </span>
          )}
        </button>
      </div>

      {/* Modal com instruções caso seja iOS ou desktop */}
      <PwaInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
