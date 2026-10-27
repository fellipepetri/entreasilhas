"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PwaInstallModal } from "@/components/pwa-install-modal";

export function PwaTopBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Não exibir se o usuário já estiver dentro do PWA instalado (Standalone)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // 2. Não exibir se o usuário fechou o banner nesta sessão
    const isDismissed = sessionStorage.getItem("eai_pwa_banner_dismissed");
    if (isDismissed === "true") {
      return;
    }

    // 3. Capturar evento de instalação nativo no Android/Chrome
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // 4. Efeito de descer do topo após breve delay para chamar atenção sutilmente
    setIsRendered(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("eai_pwa_banner_dismissed", "true");
    setTimeout(() => {
      setIsRendered(false);
    }, 400);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsVisible(false);
        setIsRendered(false);
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
      {/* Banner / Card flutuante que desce do topo */}
      <aside
        aria-label="Instalação do Aplicativo"
        className={`fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-lg transition-all duration-500 ease-out transform ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-24 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="relative flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-[#182232]/95 px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-2xl backdrop-blur-xl ring-1 ring-black/40">
          {/* Lado Esquerdo: Ícone da Marca */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#16c2c0]/25 to-[#1498d5]/25 p-1.5 border border-white/20 shadow-md">
              <Image
                src="/icons/icon-192x192.png"
                alt="Entre as Ilhas"
                width={32}
                height={32}
                className="object-contain rounded-lg"
              />
            </div>

            {/* Texto Central */}
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                Instale o app Entre as Ilhas
              </p>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-tight truncate">
                Acesse mais rápido direto da sua tela inicial
              </p>
            </div>
          </div>

          {/* Lado Direito: Ação "Instalar app" + Botão Fechar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1 rounded-xl bg-[#1498d5]/20 hover:bg-[#1498d5]/35 border border-[#1498d5]/40 px-3 py-1.5 text-xs sm:text-sm font-bold text-[#38bdf8] hover:text-white transition active:scale-95 cursor-pointer"
            >
              <span>Instalar app</span>
            </button>

            {/* Botão de Fechar */}
            <button
              type="button"
              onClick={handleDismiss}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer text-xs"
              title="Dispensar aviso"
            >
              ✕
            </button>
          </div>
        </div>
      </aside>

      {/* Modal com instruções caso seja iOS ou desktop */}
      <PwaInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
