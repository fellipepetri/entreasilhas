"use client";

import { useEffect, useRef } from "react";
import type { HotspotTourContent } from "@/data/experience-360";

interface TourModalProps {
  content: HotspotTourContent;
  onClose: () => void;
}

export function TourModal({ content, onClose }: TourModalProps) {
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

  // Gera link seguro para o WhatsApp com a mensagem pré-configurada
  const whatsappUrl = `https://wa.me/5571999999999?text=${encodeURIComponent(
    content.whatsappMessage
  )}`;

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
        className="relative w-full max-w-xl max-h-full flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 border border-amber-500/30 text-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner com destaque comercial dourado */}
        <div className="shrink-0 relative p-5 sm:p-6 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-slate-950 text-amber-400 shadow">
              Experiência Náutica Exclusiva
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 flex items-center justify-center font-bold transition focus:outline-none"
              aria-label="Fechar modal de passeio"
            >
              ✕
            </button>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-2.5 text-slate-950">
            {content.tourTitle}
          </h3>
          <p className="text-slate-900 font-medium text-xs sm:text-sm mt-1">
            Navegue pelos cenários paradisíacos que você está explorando agora em 360°!
          </p>
        </div>

        {/* Ficha técnica do passeio */}
        <div
          data-modal-scroll="true"
          data-native-scroll="true"
          className="flex-1 min-h-0 p-5 sm:p-7 space-y-5 overflow-y-auto overscroll-contain"
        >
          {/* Grid com destaques rápidos */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block">⏱️ Duração</span>
              <span className="font-semibold text-sm sm:text-base text-white">
                {content.duration}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block">👥 Capacidade</span>
              <span className="font-semibold text-sm sm:text-base text-white">
                {content.capacity}
              </span>
            </div>
            <div className="col-span-2 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs text-slate-400 block">🚤 Embarcação</span>
              <span className="font-semibold text-sm sm:text-base text-amber-300">
                {content.boatType}
              </span>
            </div>
          </div>

          {/* Roteiro e Paradas */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-cyan-400 mb-3 flex items-center gap-2">
              <span>📍 Itinerário & Paradas</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {content.itinerary.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center mt-0.5 border border-cyan-400/40">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Comodidades inclusas */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-emerald-400 mb-3 flex items-center gap-2">
              <span>✨ O que está incluso</span>
            </h4>
            <div className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300">
              {content.includes.map((inc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Informações de valores */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs sm:text-sm">
            <span className="font-semibold block mb-1">💰 Valores & Condições:</span>
            <p className="text-amber-100/90 leading-relaxed">{content.priceInfo}</p>
          </div>
        </div>

        {/* Rodapé com Botão WhatsApp Direto */}
        <div className="shrink-0 p-4 sm:p-5 bg-slate-950/90 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3 justify-between">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            Atendimento imediato via WhatsApp da agência Entre as Ilhas.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-xl"
          >
            <span>Conversar & Reservar Passeio</span>
            <span className="text-base">💬</span>
          </a>
        </div>
      </div>
    </div>
  );
}
