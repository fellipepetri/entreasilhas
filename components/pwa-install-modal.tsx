"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PwaInstallModal({ isOpen, onClose }: PwaInstallModalProps) {
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop">("desktop");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIos) {
      setDeviceType("ios");
    } else if (isAndroid) {
      setDeviceType("android");
    } else {
      setDeviceType("desktop");
    }

    // Check if already in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Capture native install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-[#0b1a2e] p-6 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#16c2c0]/20 to-[#1498d5]/20 p-2 border border-white/20 shadow-md">
              <Image
                src="/icons/icon-192x192.png"
                alt="Entre as Ilhas"
                width={40}
                height={40}
                className="object-contain rounded-xl"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Instalar no Celular
              </h3>
              <p className="text-xs text-slate-400">
                Acesse como um aplicativo nativo no Android ou iOS
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
            title="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Seletor de Plataforma */}
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-900/90 p-1 border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setDeviceType("ios")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${
              deviceType === "ios"
                ? "bg-[linear-gradient(135deg,#16c2c0,#1498d5)] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🍏</span>
            <span>iPhone / iPad (iOS)</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceType("android")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${
              deviceType === "android"
                ? "bg-[linear-gradient(135deg,#16c2c0,#1498d5)] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🤖</span>
            <span>Android</span>
          </button>
        </div>

        {/* Instruções por Plataforma */}
        <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/50 p-4">
          {deviceType === "ios" ? (
            <div className="space-y-3 text-xs sm:text-sm text-slate-200">
              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-400/30">
                  1
                </span>
                <p>
                  Abra este link no navegador <strong className="text-white">Safari</strong> do seu iPhone.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-400/30">
                  2
                </span>
                <p>
                  Toque no botão <strong className="text-white">Compartilhar</strong>{" "}
                  <span className="inline-block px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-xs">
                    ⎋ (quadrado com seta para cima)
                  </span>{" "}
                  na barra inferior do Safari.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-400/30">
                  3
                </span>
                <p>
                  Role para baixo na lista e toque em{" "}
                  <strong className="text-cyan-300">➕ "Adicionar à Tela de Início"</strong>. Depois toque em <strong className="text-white">Adicionar</strong> no canto superior.
                </p>
              </div>

              <div className="mt-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-2.5 text-xs text-emerald-300">
                ✨ <strong>Pronto!</strong> O app será fixado na tela inicial do seu iPhone e abrirá em tela cheia, sem barra de navegação.
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs sm:text-sm text-slate-200">
              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-400/30">
                  1
                </span>
                <p>
                  Abra este link no navegador <strong className="text-white">Google Chrome</strong> do seu celular Android.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-400/30">
                  2
                </span>
                <p>
                  Toque no menu de <strong className="text-white">três pontinhos (⋮)</strong> no canto superior direito da tela.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-400/30">
                  3
                </span>
                <p>
                  Selecione <strong className="text-cyan-300">"Instalar aplicativo"</strong> ou <strong className="text-cyan-300">"Adicionar à tela inicial"</strong>.
                </p>
              </div>

              {deferredPrompt && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full rounded-xl bg-[linear-gradient(135deg,#16c2c0,#1498d5)] py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg transition hover:brightness-105 active:scale-95"
                  >
                    ⚡ Instalar Diretamente Agora
                  </button>
                </div>
              )}

              <div className="mt-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-2.5 text-xs text-emerald-300">
                ✨ <strong>Pronto!</strong> O ícone da Entre as Ilhas será criado junto aos seus outros aplicativos instalados.
              </div>
            </div>
          )}
        </div>

        {/* Benefícios */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400">
          <div className="rounded-lg bg-white/5 p-2 border border-white/5">
            <span className="text-sm block mb-0.5">🚀</span>
            <span className="text-slate-200 font-medium">Tela Cheia</span>
            <span className="block text-[10px]">Sem barra de URL</span>
          </div>
          <div className="rounded-lg bg-white/5 p-2 border border-white/5">
            <span className="text-sm block mb-0.5">🔒</span>
            <span className="text-slate-200 font-medium">Login Salvo</span>
            <span className="block text-[10px]">Acesso direto</span>
          </div>
          <div className="rounded-lg bg-white/5 p-2 border border-white/5">
            <span className="text-sm block mb-0.5">⚡</span>
            <span className="text-slate-200 font-medium">Ultra Rápido</span>
            <span className="block text-[10px]">Sempre atualizado</span>
          </div>
        </div>

        {/* Botão Fechar */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            Entendi, fechar
          </button>
        </div>
      </div>
    </div>
  );
}
