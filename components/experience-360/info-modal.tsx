"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { HotspotInfoContent } from "@/data/experience-360";

interface InfoModalProps {
  content: HotspotInfoContent;
  onClose: () => void;
}

export function InfoModal({ content, onClose }: InfoModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center px-2.5 sm:px-6 pt-14 sm:pt-24 pb-2.5 sm:pb-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        data-modal-card="true"
        data-native-scroll="true"
        className="relative w-full max-w-lg max-h-full flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 border border-white/20 text-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner com foto ou gradiente */}
        {content.photoUrl && (
          <div className="shrink-0 relative h-36 sm:h-44 w-full overflow-hidden">
            <Image
              src={content.photoUrl}
              alt={content.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            {content.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-slate-950 backdrop-blur-sm shadow">
                {content.badge}
              </span>
            )}
          </div>
        )}

        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition focus:outline-none"
          aria-label="Fechar detalhes"
        >
          ✕
        </button>

        {/* Conteúdo textual */}
        <div
          data-modal-scroll="true"
          data-native-scroll="true"
          className="flex-1 min-h-0 p-5 sm:p-7 space-y-4 overflow-y-auto overscroll-contain"
        >
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-cyan-400">
              {content.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {content.title}
            </h3>
          </div>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {content.description}
          </p>

          {content.curiosity && (
            <div className="rounded-2xl bg-cyan-950/50 border border-cyan-500/30 p-4">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs tracking-wide uppercase mb-1">
                <span>💡 Curiosidade Local</span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed">
                {content.curiosity}
              </p>
            </div>
          )}

          {content.history && (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs tracking-wide uppercase mb-1">
                <span>🏛️ Memória & História</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {content.history}
              </p>
            </div>
          )}

          {content.tips && (
            <div className="rounded-2xl bg-amber-950/40 border border-amber-500/20 p-4">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs tracking-wide uppercase mb-1">
                <span>⚓ Dica Náutica</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                {content.tips}
              </p>
            </div>
          )}
        </div>

        {/* Rodapé com botão de ação */}
        <div className="shrink-0 p-4 sm:p-5 bg-slate-950/80 border-t border-white/10 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-sky-500 transition shadow-lg"
          >
            Continuar Explorando 360°
          </button>
        </div>
      </div>
    </div>
  );
}
