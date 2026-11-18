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

  // Parâmetros para o anel de loading circular náutico ao redor da logo
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
          {/* ========================================================
              ANEL DE LOADING CIRCULAR NÁUTICO AO REDOR DA LOGO
              (Substitui a barra horizontal com os mesmos efeitos)
              * Progresso suave de 0 a 100% preenchendo no sentido horário (inicia no topo)
              * Gradiente náutico: esmeralda -> ciano -> céu
              * Brilho / Glow neon ciano (drop-shadow)
              * Feixe de luz varrendo o anel continuamente (shimmer sweep)
              * Guia luminosa / ponto brilhante na ponta do progresso
              * Calha estática de fundo preservada (cyan-400/20)
             ======================================================== */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute h-32 w-32 sm:h-44 sm:w-44 transition-opacity duration-500 ${
              isExiting ? "opacity-0" : "opacity-100"
            }`}
          >
            <svg
              className="h-full w-full overflow-visible drop-shadow-[0_0_25px_rgba(34,211,238,0.3)]"
              viewBox="0 0 100 100"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Carregando Entre as Ilhas"
            >
              <defs>
                {/* 1. Gradiente tropical (esmeralda -> ciano -> céu) */}
                <linearGradient id="preloader-active-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#7dd3fc" />
                </linearGradient>

                {/* 2. Gradiente do feixe de luz que varre o anel */}
                <linearGradient id="preloader-sweep-linear" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="42%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="58%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>

                {/* 3. Máscara que limita o feixe de luz apenas ao trecho já preenchido */}
                <mask id="preloader-progress-mask">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 50 50)"
                    style={{ transition: "stroke-dashoffset 200ms ease-out" }}
                  />
                </mask>

                {/* 4. Filtro de brilho intenso na ponta do feixe */}
                <filter id="preloader-tip-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Calha/Trilho náutico de fundo (anel estático apontado com a seta amarela) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="rgba(34, 211, 238, 0.22)"
                strokeWidth="2.5"
              />

              {/* Arco de progresso ativo com gradiente tropical e glow neon */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="url(#preloader-active-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 50 50)"
                style={{
                  transition: "stroke-dashoffset 200ms ease-out",
                  filter:
                    "drop-shadow(0 0 8px rgba(34, 211, 238, 0.9)) drop-shadow(0 0 14px rgba(52, 211, 153, 0.45))",
                }}
              />

              {/* Feixe de luz varrendo o anel circular continuamente (onda de brilho de 1.8s) */}
              <g mask="url(#preloader-progress-mask)">
                <g
                  style={{
                    transformOrigin: "50px 50px",
                    animation: "preloader-halo-spin 1.8s linear infinite",
                  }}
                >
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="url(#preloader-sweep-linear)"
                    strokeWidth="3.5"
                  />
                </g>
              </g>

              {/* Ponto luminoso guia na ponta do arco em rotação sincronizada */}
              <g
                style={{
                  transform: `rotate(${(progress / 100) * 360 - 90}deg)`,
                  transformOrigin: "50px 50px",
                  transition: "transform 200ms ease-out",
                  opacity: progress > 1 ? 1 : 0,
                }}
              >
                <circle
                  cx={50 + radius}
                  cy="50"
                  r="2.8"
                  fill="#ffffff"
                  filter="url(#preloader-tip-glow)"
                  style={{
                    filter:
                      "drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 8px rgba(34, 211, 238, 1))",
                  }}
                />
              </g>
            </svg>
          </div>

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
            TEXTO DA MARCA ABAIXO DA LOGO
            (A barra de loading foi transferida para o anel da logo)
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
          <p className="mt-1.5 text-[11px] sm:text-xs font-medium tracking-[0.16em] text-cyan-300/85 uppercase">
            Experiências Náuticas
          </p>
        </div>
      </div>
    </div>
  );
}
