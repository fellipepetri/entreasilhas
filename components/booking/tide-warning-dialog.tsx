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
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-amber-200 text-slate-900 animate-scaleUp overflow-hidden"
      >
        {/* Faixa decorativa superior */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500" />

        {/* Ícone de alerta em destaque */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center shrink-0 text-2xl shadow-xs">
            ⚠️
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 mb-1.5">
              Condição de Maré Desfavorável
            </span>
            <h3
              id="tide-warning-title"
              className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug"
            >
              {tideStatus.warningTitle || "Aviso sobre a Condição da Maré"}
            </h3>
          </div>
        </div>

        {/* Corpo explicativo */}
        <div id="tide-warning-desc" className="mt-4 space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Na data selecionada (<strong className="text-slate-900 capitalize">{formattedDate}</strong>), a maré prevista durante o passeio é:
          </p>

          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <span className="text-base">{tideStatus.morningTide.icon}</span>
              <span>Maré Matinal (09h–11h30): {tideStatus.morningTide.name}</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-normal">
              {tideStatus.morningTide.description}
            </p>
          </div>

          {/* Observação náutica específica de horário ou parada rasa/submersa */}
          {tideStatus.specificNotice && (
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 text-xs font-medium leading-relaxed">
              {tideStatus.specificNotice}
            </div>
          )}

          {tideStatus.alternativeStopNote && (
            <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs leading-relaxed">
              💡 <strong>Adaptação do Marinheiro:</strong> {tideStatus.alternativeStopNote}
            </div>
          )}

          <div className="text-xs text-slate-600 space-y-1">
            <p>
              • Roteiro: <strong className="text-slate-900">{route.name}</strong>
            </p>
            <p>
              • Melhor condição de maré:{" "}
              <strong className="text-slate-900">{route.bestTidesLabel}</strong>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-[13px] font-semibold leading-relaxed">
            Tem certeza que deseja selecionar este roteiro, visto que a maré não está favorável para as praias/paradas?
          </div>
        </div>

        {/* Botões de Ação com Sim e Não */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs text-center"
          >
            Não (desselecionar roteiro)
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm transition shadow-md hover:shadow-lg cursor-pointer text-center"
          >
            Sim (selecionar roteiro)
          </button>
        </div>
      </div>
    </div>
  );
}
