"use client";

import Link from "next/link";
import { PanoramaViewer } from "@/components/experience-360/panorama-viewer";

export function Experience360Section() {
  return (
    <section
      id="experiencia-360"
      className="scroll-mt-20 lg:scroll-mt-24 relative z-0 -mt-14 md:-mt-16 lg:-mt-20 overflow-hidden bg-slate-950 pt-28 sm:pt-32 lg:pt-36 pb-20 lg:pb-32 text-white"
    >
      {/* Luzes de fundo oceânicas que formam o degradê da seção 360 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-10 left-1/4 h-[44rem] w-[44rem] rounded-full bg-cyan-600/20 blur-[130px]" />
        <div className="absolute top-1/2 -right-40 h-[32rem] w-[32rem] rounded-full bg-emerald-600/15 blur-[130px]" />
        <div className="absolute -bottom-20 left-1/3 h-[25rem] w-[25rem] rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/10 pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Entre as Ilhas 360º
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              ENTRE AS ILHAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">360°</span>
            </h2>
            <p className="mt-3 text-lg sm:text-xl font-medium text-slate-300">
              Explore. Descubra. Viva a Baía antes mesmo de embarcar.
            </p>
            <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed">
              Arraste com o mouse ou gire o smartphone para olhar em todas as direções.
              Conecte-se com as praias da <strong>Ilha dos Frades</strong>, o cais de{" "}
              <strong>Bom Jesus dos Passos</strong> e os bancos de areia da <strong>Coroa do Frade</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/experiencia-360"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl transition hover:scale-105"
            >
              <span>Abrir Experiência Imersiva Completa</span>
              <span>↗</span>
            </Link>
          </div>
        </div>

        {/* Visualizador 360 Incorporado */}
        <div className="relative">
          <PanoramaViewer />
        </div>

        {/* Grid de Funcionalidades Exclusivas */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition">
            <span className="text-2xl block mb-2">🧭</span>
            <h3 className="font-semibold text-xs sm:text-sm text-white">Navegação 360°</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Transite entre ilhas, enseadas e bancos de areia.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition">
            <span className="text-2xl block mb-2">🗺️</span>
            <h3 className="font-semibold text-xs sm:text-sm text-white">Radar Náutico</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Localização e cone de visão da Baía em tempo real.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition">
            <span className="text-2xl block mb-2">📍</span>
            <h3 className="font-semibold text-xs sm:text-sm text-white">Hotspots Culturais</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Histórias, curiosidades e dicas de cada recanto.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition">
            <span className="text-2xl block mb-2">🚤</span>
            <h3 className="font-semibold text-xs sm:text-sm text-amber-300">Vivencie o Passeio</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Descubra roteiros de lancha e reserve pelo WhatsApp.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition">
            <span className="text-2xl block mb-2">📸</span>
            <h3 className="font-semibold text-xs sm:text-sm text-white">Modo Fotógrafo</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Capture seu enquadramento e gere cartão postal PNG.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/40 transition">
            <span className="text-2xl block mb-2">🐚</span>
            <h3 className="font-semibold text-xs sm:text-sm text-yellow-300">Modo Descubra</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Encontre conchas (peguari), siris e caranguejos nativos da Baía.
            </p>
          </div>
        </div>
      </div>

      {/* Onda inferior suave conectando com a galeria branca */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-[-1px] overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="block h-14 w-full md:h-16 lg:h-20"
        >
          <path
            fill="#ffffff"
            d="M0 68C40 56 80 44 120 44C160 44 200 56 240 68C280 80 320 92 360 92C400 92 440 80 480 68C520 56 560 44 600 44C640 44 680 56 720 68C760 80 800 92 840 92C880 92 920 80 960 68C1000 56 1040 44 1080 44C1120 44 1160 56 1200 68C1240 80 1280 92 1320 92C1360 92 1400 80 1440 68V160H0Z"
          />
        </svg>
      </div>
    </section>
  );
}
