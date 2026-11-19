"use client";

import { useEffect } from "react";
import type { BookingRouteOption } from "@/data/booking";
import { evaluateRouteTideCompatibility } from "@/lib/tide-engine";

export interface TideWarningDialogProps {
  isOpen: boolean;
  route: BookingRouteOption | null;
  selectedDate: Date;
  onConfirm: () => void;
  onCancel: () => void;
}

export function TideWarningDialog({
  isOpen,
  route,
  selectedDate,
  onConfirm,
  onCancel
}: TideWarningDialogProps) {
  // Tecla Escape para fechar cancelando
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !route) return null;

  const tideStatus = evaluateRouteTideCompatibility(
    route.bestTides,
    selectedDate,
    route.name,
    route.id
  );

  const formattedDate = selectedDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
      onClick={onCancel}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="tide-warning-title"
      aria-describedby="tide-warning-desc"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-cyan-200 text-slate-900 animate-scaleUp overflow-hidden"
      >
        {/* Faixa decorativa superior */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500" />

        {/* Ícone náutico amigável */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center shrink-0 text-2xl shadow-xs">
            🧭
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-200 mb-1.5">
              Dica Náutica de Maré
            </span>
            <h3
              id="tide-warning-title"
              className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug"
            >
              {route.name}
            </h3>
          </div>
        </div>

        {/* Corpo explicativo */}
        <div id="tide-warning-desc" className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Na data selecionada (<strong className="text-slate-900 capitalize">{formattedDate}</strong>), a maré prevista no passeio estará como:
          </p>

          <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200 text-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sky-950">
              <span className="text-base">{tideStatus.morningTide.icon}</span>
              <span>Maré Prevista: {tideStatus.morningTide.name}</span>
            </div>
            <p className="text-xs text-sky-900/80 leading-normal">
              {tideStatus.morningTide.description}
            </p>
          </div>

          {/* Observação náutica específica */}
          {tideStatus.alternativeStopNote ? (
            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs leading-relaxed">
              💡 <strong>Adaptação do Marinheiro:</strong> {tideStatus.alternativeStopNote}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs leading-relaxed">
              💡 Nosso marinheiro experiente ajustará as melhores paradas e horários para você aproveitar o passeio ao máximo!
            </div>
          )}

          <div className="text-xs text-slate-500">
            Melhor condição para este roteiro: <strong className="text-slate-800">{route.bestTidesLabel}</strong>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer text-center"
          >
            Ver outros roteiros
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-xl bg-[linear-gradient(135deg,#16c2c0,#1498d5)] hover:brightness-105 text-white font-extrabold text-xs sm:text-sm shadow-sm transition cursor-pointer text-center"
          >
            Confirmar este Roteiro
          </button>
        </div>
      </div>
    </div>
  );
}
