"use client";

import { useState } from "react";
import { PANORAMA_SCENES, type PanoramaScene } from "@/data/experience-360";

interface MiniRadarMapProps {
  currentScene: PanoramaScene;
  currentYaw: number; // em graus (-180 a 180)
  onSelectScene: (sceneId: string) => void;
}

export function MiniRadarMap({
  currentScene,
  currentYaw,
  onSelectScene
}: MiniRadarMapProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // O cone de visão é calculado a partir do yaw da câmera (0° = norte)
  const angleDeg = currentYaw;

  return (
    <div className="relative pointer-events-auto">
      {/* Container do mini-mapa */}
      <div
        className={[
          "transition-all duration-300 ease-out overflow-hidden rounded-2xl border border-white/25 bg-slate-950/85 backdrop-blur-md shadow-2xl text-white",
          isExpanded ? "w-[78vw] max-w-xs sm:w-80 p-2.5 sm:p-3" : "w-32 sm:w-40 p-1.5 sm:p-2"
        ].join(" ")}
      >
        {/* Cabeçalho do Mini-Mapa */}
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[0.65rem] sm:text-[0.7rem] font-semibold tracking-wider uppercase text-cyan-300">
              Radar Baía
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[0.65rem] text-slate-300 hover:text-white px-1.5 py-0.5 rounded bg-white/10 transition"
            aria-label={isExpanded ? "Recolher radar" : "Expandir radar"}
          >
            {isExpanded ? "Minimizar" : "Expandir"}
          </button>
        </div>

        {/* Área do Mapa Cartográfico SVG */}
        <div
          className={[
            "relative w-full rounded-xl overflow-hidden bg-gradient-to-b from-[#092038] to-[#041224] border border-cyan-500/20",
            isExpanded ? "h-44 sm:h-56" : "h-20 sm:h-26"
          ].join(" ")}
        >
          {/* Fundo do mar e grade náutica */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          >
            {/* Grade de coordenadas náuticas */}
            <defs>
              <pattern id="radarGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#38bdf8" strokeWidth="0.3" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#radarGrid)" />

            {/* Curvas batimétricas / ilhas da Baía de Todos-os-Santos */}
            {/* Ilha dos Frades */}
            <path
              d="M 52,55 Q 65,48 74,62 Q 78,76 68,88 Q 55,85 52,70 Z"
              fill="#10b981"
              fillOpacity="0.25"
              stroke="#10b981"
              strokeWidth="0.8"
            />
            {/* Bom Jesus dos Passos */}
            <path
              d="M 28,32 Q 45,28 48,45 Q 42,60 30,55 Q 24,42 28,32 Z"
              fill="#10b981"
              fillOpacity="0.35"
              stroke="#34d399"
              strokeWidth="0.8"
            />
            {/* Banco da Coroa do Frade */}
            <ellipse
              cx="75"
              cy="48"
              rx="9"
              ry="5"
              fill="#fbbf24"
              fillOpacity="0.25"
              stroke="#f59e0b"
              strokeWidth="0.6"
              strokeDasharray="1,1"
            />
          </svg>

          {/* Rótulos cartográficos quando expandido */}
          {isExpanded && (
            <div className="absolute inset-0 pointer-events-none select-none text-[9px] font-medium tracking-tight">
              <span className="absolute left-6 top-6 text-emerald-300/80">Bom Jesus</span>
              <span className="absolute right-6 bottom-4 text-emerald-300/80">Ilha dos Frades</span>
              <span className="absolute right-4 top-8 text-amber-300/80">Coroa do Frade</span>
              <span className="absolute left-6 bottom-2 text-cyan-300/60">Enseada</span>
            </div>
          )}

          {/* Cone de Visão do Usuário em tempo real */}
          <div
            className="absolute pointer-events-none transition-transform duration-75"
            style={{
              left: `${currentScene.mapCoords.x}%`,
              top: `${currentScene.mapCoords.y}%`,
              transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`
            }}
          >
            {/* SVG do cone de visão estilo radar */}
            <svg width="60" height="60" viewBox="0 0 60 60" className="-translate-x-1/2 -translate-y-1/2 ml-[30px] mt-[30px]">
              <defs>
                <radialGradient id="coneGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Cone triangular abrindo para a frente */}
              <polygon
                points="30,30 15,0 45,0"
                fill="url(#coneGrad)"
              />
            </svg>
          </div>

          {/* Marcadores das Cenas / Pontos */}
          {PANORAMA_SCENES.map((scene) => {
            const isCurrent = scene.id === currentScene.id;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => onSelectScene(scene.id)}
                title={scene.title}
                className={[
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 z-10 flex items-center justify-center group focus:outline-none",
                  isCurrent
                    ? "w-4 h-4 bg-cyan-400 ring-4 ring-cyan-400/40 shadow-lg scale-110"
                    : "w-2.5 h-2.5 bg-white/70 hover:bg-white hover:scale-125 hover:ring-2 ring-white/50"
                ].join(" ")}
                style={{
                  left: `${scene.mapCoords.x}%`,
                  top: `${scene.mapCoords.y}%`
                }}
              >
                {/* Pulso animado no ponto atual */}
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full bg-cyan-300 animate-ping opacity-75" />
                )}

                {/* Tooltip flutuante no mapa */}
                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-black/90 text-[10px] text-white px-2 py-0.5 rounded shadow pointer-events-none z-20">
                  {scene.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Nome do ponto atual */}
        <div className="mt-1.5 flex items-center justify-between text-[0.7rem] text-slate-300">
          <span className="truncate max-w-[160px] font-medium text-white">
            📍 {currentScene.title}
          </span>
          <span className="text-[0.65rem] text-cyan-400/90 font-mono">
            {Math.round(((angleDeg % 360) + 360) % 360)}° N
          </span>
        </div>
      </div>
    </div>
  );
}
