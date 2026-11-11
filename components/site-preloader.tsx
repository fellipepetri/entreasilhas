"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * SitePreloader:
 * Exibe a animação de entrada com Zoom In e Bounce na logo,
 * efeito de loading náutico orbital ao redor e barra de progresso abaixo,
 * e finaliza com Bounce invertido e Zoom Out ao concluir o carregamento de todo o site.
 *
 * Estrutura preparada para que o usuário possa facilmente substituir
 * a logo estática por uma animação personalizada no futuro.
 */
export function SitePreloader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"entering" | "loading" | "exiting" | "done">("entering");
  const [progress, setProgress] = useState(12);
  const [isMounted, setIsMounted] = useState(true);

  // Não exibe o preloader completo dentro dos painéis administrativos para não atrapalhar o fluxo de trabalho
  const isAdminRoute =
    pathname?.startsWith("/admin-painel") || pathname?.startsWith("/agenda-painel");

  useEffect(() => {
    if (isAdminRoute) {
      setIsMounted(false);
      return;
    }

    // Trava a rolagem da página enquanto o preloader estiver ativo
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 1. Transição da entrada (Zoom In + Bounce: 900ms) para o estado de loading
    const enterTimer = setTimeout(() => {
      setPhase((prev) => (prev === "entering" ? "loading" : prev));
    }, 900);

    // 2. Simulação de progresso fluida e orgânica
    let currentProgress = 15;
    const progressInterval = setInterval(() => {
      setProgress((old) => {
        if (old >= 92) return old;
        const inc = Math.random() * 12 + 4;
        currentProgress = Math.min(92, old + inc);
        return currentProgress;
      });
    }, 180);

    // 3. Detecção real de carregamento do DOM e recursos da página
    let isPageLoaded = false;
    const minDisplayTimePassed = { current: false };

    const finishPreloader = () => {
      clearInterval(progressInterval);
      setProgress(100);

      // Pequena pausa para o usuário ver o 100% antes da saída com bounce e zoom out
      setTimeout(() => {
        setPhase("exiting");

        // Tempo para o bounce-out e o fade-out do fundo terminarem (~750ms)
        setTimeout(() => {
          document.body.style.overflow = originalOverflow || "";
          setPhase("done");
          setIsMounted(false);
        }, 750);
      }, 250);
    };

    const handleReady = () => {
      isPageLoaded = true;
      if (minDisplayTimePassed.current) {
        finishPreloader();
      }
    };

    if (document.readyState === "complete") {
      isPageLoaded = true;
    } else {
      window.addEventListener("load", handleReady, { once: true });
    }

    // Tempo mínimo de exibição para apreciar a animação de entrada com zoom in & bounce (1.4s)
    const minTimer = setTimeout(() => {
      minDisplayTimePassed.current = true;
      if (isPageLoaded) {
        finishPreloader();
      }
    }, 1400);

    // Timeout de segurança absoluto (máx. 3.8s) para conexões muito lentas
    const fallbackTimer = setTimeout(() => {
      if (!isPageLoaded || !minDisplayTimePassed.current) {
        finishPreloader();
      }
    }, 3800);

    return () => {
      clearTimeout(enterTimer);
      clearInterval(progressInterval);
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
      window.removeEventListener("load", handleReady);
      document.body.style.overflow = originalOverflow || "";
    };
  }, [isAdminRoute]);

  if (!isMounted || isAdminRoute) {
    return null;
  }

  const isExiting = phase === "exiting";

  return (
    <div
      aria-hidden={phase === "done"}
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-600 ease-out select-none pointer-events-auto ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(circle at center, #092648 0%, #06172d 45%, #030d1a 100%)"
      }}
    >
      {/* Luz ambiente azul tropical ao fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 opacity-40 blur-3xl bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.35)_0%,rgba(16,185,129,0.15)_35%,transparent_70%)]"
      />

      <div className="relative flex flex-col items-center justify-center px-6">
        {/* ========================================================
            CONTAINER DA LOGO COM EFEITOS ORBITAIS AO REDOR
           ======================================================== */}
        <div className="relative flex items-center justify-center">
          {/* Ondas náuticas concêntricas pulsantes */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute h-40 w-40 sm:h-52 sm:w-52 rounded-full border border-cyan-400/25 animate-preloader-pulse transition-opacity duration-500 ${
              isExiting ? "opacity-0" : "opacity-100"
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute h-48 w-48 sm:h-64 sm:w-64 rounded-full border border-teal-400/15 animate-preloader-pulse transition-opacity duration-500 delay-300 ${
              isExiting ? "opacity-0" : "opacity-100"
            }`}
            style={{ animationDelay: "0.8s" }}
          />

          {/* Anel orbital giratório (Bússola Náutica) ao redor da logo */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute h-36 w-36 sm:h-48 sm:w-48 rounded-full border border-dashed border-cyan-300/40 animate-preloader-spin transition-opacity duration-500 ${
              isExiting ? "opacity-0" : "opacity-100"
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute h-32 w-32 sm:h-44 sm:w-44 rounded-full border border-cyan-400/20 shadow-[0_0_35px_rgba(34,211,238,0.25)] transition-opacity duration-500 ${
              isExiting ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* ========================================================
              ÁREA DA LOGO DO ENTRE AS ILHAS
              * Animação de entrada: Zoom In com Bounce no final (.animate-preloader-logo-in)
              * Animação de saída: Bounce e Zoom Out (.animate-preloader-logo-out)
              * Futura substituição: É possível substituir o componente <Image>
                abaixo por uma animação Lottie, vídeo transparente ou SVG.
             ======================================================== */}
          <div
            className={`relative z-10 flex items-center justify-center ${
              isExiting ? "animate-preloader-logo-out" : "animate-preloader-logo-in"
            }`}
          >
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 drop-shadow-[0_12px_32px_rgba(34,211,238,0.40)]">
              <Image
                src="/images/logoeai.png"
                alt="Entre as Ilhas"
                fill
                priority
                sizes="(max-width: 640px) 96px, 128px"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            EFEITO DE LOADING E TEXTO ABAIXO DA LOGO
           ======================================================== */}
        <div
          className={`mt-8 flex flex-col items-center text-center transition-all duration-500 ${
            isExiting ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
          }`}
        >
          {/* Nome da Marca com tipografia náutica */}
          <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-[0.28em] text-white drop-shadow-sm">
            Entre as Ilhas
          </h2>
          <p className="mt-1 text-[11px] sm:text-xs font-medium tracking-[0.16em] text-cyan-300/80 uppercase">
            Experiências Náuticas
          </p>

          {/* Barra de Carregamento com Onda de Brilho */}
          <div className="relative mt-6 h-1.5 w-44 sm:w-56 overflow-hidden rounded-full bg-white/10 p-[1px] shadow-inner backdrop-blur-sm">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-300 transition-all duration-200 ease-out shadow-[0_0_12px_rgba(34,211,238,0.8)]"
              style={{ width: `${progress}%` }}
            />
            {/* Feixe de luz varrendo a barra */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-preloader-sweep"
            />
          </div>

          {/* Porcentagem sutil e status */}
          <div className="mt-2.5 flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-slate-400 tracking-wider">
            <span>Carregando</span>
            <span className="text-cyan-300 font-mono">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
