"use client";

import { useEffect, useRef } from "react";
import {
  TOTAL_SECRETS_COUNT,
  REGIONAL_SECRETS_CATALOG,
  type HotspotSecretContent
} from "@/data/experience-360";

interface SecretsModalProps {
  discoveredContent: HotspotSecretContent | null;
  foundSecrets: string[];
  onClose: () => void;
}

export function SecretsModal({
  discoveredContent,
  foundSecrets,
  onClose
}: SecretsModalProps) {
  const isAllCompleted = foundSecrets.length >= TOTAL_SECRETS_COUNT;
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fechar modal ao pressionar tecla Escape (Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Bloqueia qualquer rolagem ao girar scroll no backdrop escuro
  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    const handleBackdropWheel = (e: WheelEvent) => {
      if (e.target === backdrop) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    backdrop.addEventListener("wheel", handleBackdropWheel, { passive: false });
    return () => backdrop.removeEventListener("wheel", handleBackdropWheel);
  }, []);

  // Direciona o scroll para o corpo do modal mesmo se o cursor estiver sobre o cabeçalho ou rodapé
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleCardWheel = (e: WheelEvent) => {
      const scrollBody = card.querySelector<HTMLElement>("[data-modal-scroll='true']");
      if (!scrollBody) return;

      const target = e.target as HTMLElement | null;
      const isInsideScroll = Boolean(target?.closest("[data-modal-scroll='true']"));

      if (!isInsideScroll) {
        e.preventDefault();
        scrollBody.scrollTop += e.deltaY;
      }
    };

    card.addEventListener("wheel", handleCardWheel, { passive: false });
    return () => card.removeEventListener("wheel", handleCardWheel);
  }, []);

  return (
    <div
      ref={backdropRef}
      data-modal-container="true"
      className="fixed inset-0 z-50 flex items-center justify-center px-2.5 sm:px-6 pt-14 sm:pt-24 pb-2.5 sm:pb-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        data-modal-card="true"
        data-native-scroll="true"
        className="relative w-full max-w-lg max-h-full flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 border border-yellow-500/40 text-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo festivo / gamificado com ícone do tesouro */}
        <div className="relative shrink-0 p-5 sm:p-6 bg-gradient-to-b from-yellow-500/20 via-amber-500/10 to-slate-900 text-center border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition focus:outline-none"
            aria-label="Fechar modal de segredo"
          >
            ✕
          </button>

          {/* Ícone reluzente */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 flex items-center justify-center text-3xl sm:text-4xl shadow-xl ring-8 ring-yellow-400/20 animate-bounce">
            {discoveredContent?.icon || "✨"}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
              {discoveredContent?.rarity || "Tesouro Encontrado"}
            </span>
            {discoveredContent?.category && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {discoveredContent.category}
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-white mt-2 leading-tight">
            {discoveredContent?.name || "Espécie Descoberta!"}
          </h3>

          {discoveredContent?.scientificName && (
            <p className="text-xs italic text-yellow-200/80 font-serif mt-0.5">
              {discoveredContent.scientificName}
            </p>
          )}

          {discoveredContent?.habitat && (
            <p className="text-[11px] text-slate-300 mt-1 flex items-center justify-center gap-1">
              <span>📍</span>
              <span>{discoveredContent.habitat}</span>
            </p>
          )}
        </div>

        {/* Corpo com rolagem contendo os textos informativos da espécie */}
        <div
          data-modal-scroll="true"
          data-native-scroll="true"
          className="flex-1 min-h-0 p-5 sm:p-6 space-y-4 overflow-y-auto overscroll-contain"
        >
          {/* 1. História e características biológicas */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-1.5 text-yellow-300 font-bold text-xs uppercase tracking-wider">
              <span>📖</span>
              <span>Sobre a Espécie na Região</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {discoveredContent?.story}
            </p>
          </div>

          {/* 2. Tradição e culinária baiana de raiz */}
          {discoveredContent?.culinaryTradition && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-yellow-950/20 border border-amber-500/30">
              <div className="flex items-center gap-2 mb-1.5 text-amber-300 font-bold text-xs uppercase tracking-wider">
                <span>🍽️</span>
                <span>Culinária & Tradição Baiana</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                {discoveredContent.culinaryTradition}
              </p>
            </div>
          )}

          {/* 3. Curiosidade ecológica / preservação */}
          {discoveredContent?.ecologicalCuriosity && (
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
              <div className="flex items-center gap-2 mb-1.5 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                <span>🌿</span>
                <span>Curiosidade & Preservação</span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed">
                {discoveredContent.ecologicalCuriosity}
              </p>
            </div>
          )}

          {/* 4. Mini Álbum de Coleção de Espécies Regionais */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10">
            <div className="flex items-center justify-between text-xs font-semibold mb-2.5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span>🧭</span>
                <span>Álbum da Fauna da Baía:</span>
              </span>
              <span className="text-cyan-300 font-bold">
                {foundSecrets.length} de {TOTAL_SECRETS_COUNT} encontrados
              </span>
            </div>

            {/* Barra de progresso */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-yellow-400 transition-all duration-500 rounded-full"
                style={{
                  width: `${(foundSecrets.length / TOTAL_SECRETS_COUNT) * 100}%`
                }}
              />
            </div>

            {/* Grid dos 4 tesouros regionais */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {REGIONAL_SECRETS_CATALOG.map((item) => {
                const isFound = foundSecrets.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={[
                      "p-2 rounded-xl flex items-center gap-2 border transition",
                      isFound
                        ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                        : "bg-white/5 border-white/10 text-slate-400 opacity-60"
                    ].join(" ")}
                  >
                    <span className="text-base">{item.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate text-[11px] text-white">
                        {item.name}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">
                        {isFound ? "✓ Descoberto" : item.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Se completou todos os 4 tesouros regionais! */}
          {isAllCompleted && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/40 text-center animate-pulse">
              <span className="text-3xl block mb-1">🎉</span>
              <h5 className="font-bold text-sm text-emerald-300">
                Parabéns, Especialista da Baía!
              </h5>
              <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                Você descobriu todas as espécies e conchas nativas de Bom Jesus
                dos Passos e região! Mostre seu cupom exclusivo ao embarcar:
              </p>
              <div className="mt-2.5 px-4 py-2 rounded-xl bg-emerald-500/25 text-emerald-300 font-mono font-bold text-sm inline-block border border-emerald-400/50 shadow-lg">
                CUPOM: EXPLORA360
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do modal */}
        <div className="shrink-0 p-4 sm:p-5 bg-slate-950/90 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-bold text-sm transition shadow-lg hover:scale-[1.01]"
          >
            {isAllCompleted
              ? "Celebrar & Continuar Navegando"
              : "Continuar Caçada 360°"}
          </button>
        </div>
      </div>
    </div>
  );
}
