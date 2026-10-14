"use client";

import { useState } from "react";
import type { PanoramaHotspot } from "@/data/experience-360";

interface HotspotItemProps {
  hotspot: PanoramaHotspot;
  screenX: number;
  screenY: number;
  isVisible: boolean; // se está na frente da câmera (z < 1)
  isSecretFound?: boolean;
  onClick: (hotspot: PanoramaHotspot) => void;
}

export function HotspotItem({
  hotspot,
  screenX,
  screenY,
  isVisible,
  isSecretFound = false,
  onClick
}: HotspotItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible) return null;

  return (
    <div
      className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 z-10"
      style={{
        left: `${screenX}px`,
        top: `${screenY}px`,
        opacity: isVisible ? 1 : 0
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Botão Principal do Hotspot */}
      <button
        type="button"
        onClick={() => onClick(hotspot)}
        className="relative group flex items-center justify-center focus:outline-none"
        aria-label={`${hotspot.title}: ${hotspot.shortDesc}`}
      >
        {/* Renderização baseada no tipo de hotspot */}
        {hotspot.type === "navigation" && (
          <div className="relative flex items-center justify-center">
            {/* Anéis pulsantes de navegação */}
            <span className="absolute w-12 h-12 rounded-full border border-cyan-400/60 animate-ping opacity-60" />
            <span className="absolute w-10 h-10 rounded-full bg-cyan-500/20 backdrop-blur-sm" />
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-sky-400 text-white flex items-center justify-center shadow-lg border border-white/60 transition-transform duration-200 group-hover:scale-115">
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        )}

        {hotspot.type === "info" && (
          <div className="relative flex items-center justify-center">
            <span className="absolute w-11 h-11 rounded-full bg-emerald-500/25 animate-ping opacity-60" />
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-lg border border-white/70 transition-transform duration-200 group-hover:scale-115">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        )}

        {hotspot.type === "tour" && (
          <div className="relative flex items-center justify-center">
            <span className="absolute w-14 h-14 rounded-full bg-amber-400/30 animate-pulse" />
            <span className="absolute w-11 h-11 rounded-full bg-amber-500/30 animate-ping" />
            <div className="relative px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xl border-2 border-white transition-transform duration-200 group-hover:scale-110">
              <span className="text-sm">🚤</span>
              <span className="tracking-wide uppercase font-extrabold text-[10px]">Passeio VIP</span>
            </div>
          </div>
        )}

        {hotspot.type === "secret" && (
          <div className="relative flex items-center justify-center">
            {isSecretFound ? (
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-emerald-400/60 flex items-center justify-center text-sm shadow">
                <span>{hotspot.secretContent?.icon || "✨"}</span>
              </div>
            ) : (
              <>
                <span className="absolute w-10 h-10 rounded-full bg-yellow-300/40 animate-ping" />
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-200 text-slate-900 flex items-center justify-center shadow-lg border border-white transition-transform duration-200 group-hover:scale-125 animate-bounce">
                  <span className="text-base">{hotspot.secretContent?.icon || "✨"}</span>
                </div>
              </>
            )}
          </div>
        )}
      </button>

      {/* Tooltip flutuante no Hover / Foco */}
      {(isHovered || hotspot.type === "tour") && (
        <div
          className={[
            "absolute bottom-full mb-3 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200 z-30",
            isHovered ? "opacity-100 scale-100" : "opacity-90 scale-95"
          ].join(" ")}
        >
          <div className="min-w-[160px] max-w-[240px] px-3 py-2 rounded-xl bg-slate-950/90 text-white backdrop-blur-md border border-white/20 shadow-2xl text-center">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              {hotspot.type === "navigation" && <span className="text-cyan-400 text-xs">🧭 Destino</span>}
              {hotspot.type === "info" && <span className="text-emerald-400 text-xs">📍 História & Cultura</span>}
              {hotspot.type === "tour" && <span className="text-amber-400 text-xs">🚤 Roteiro Náutico</span>}
              {hotspot.type === "secret" && (
                <span className="text-yellow-300 text-xs">
                  {isSecretFound ? "✓ Descoberto" : "✨ Encontre o Segredo"}
                </span>
              )}
            </div>
            <p className="font-semibold text-xs leading-tight text-white">{hotspot.title}</p>
            <p className="text-[10px] text-slate-300 mt-1 line-clamp-2 leading-snug">
              {hotspot.shortDesc}
            </p>
            <div className="mt-1.5 text-[9px] text-cyan-300 font-medium tracking-wide uppercase">
              Clique para {hotspot.type === "navigation" ? "navegar" : "explorar"} →
            </div>
          </div>
          {/* Triângulo apontando para o botão */}
          <div className="w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-slate-950 mx-auto" />
        </div>
      )}
    </div>
  );
}
