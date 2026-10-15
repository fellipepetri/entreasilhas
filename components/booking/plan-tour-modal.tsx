"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BOOKING_ROUTES, type BookingRouteOption } from "@/data/booking";

export interface PlanTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRouteId?: string;
}

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];

const WEEKDAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function PlanTourModal({
  isOpen,
  onClose,
  initialRouteId = "ilha-dos-frades-guadalupe"
}: PlanTourModalProps) {
  const router = useRouter();

  // Data hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Amanhã como default para permitir planejamento
  const defaultDate = new Date(today);
  defaultDate.setDate(defaultDate.getDate() + 1);

  // Estados do formulário rápido
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [calendarMonth, setCalendarMonth] = useState<number>(today.getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(today.getFullYear());

  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [includeSunset, setIncludeSunset] = useState<boolean>(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(initialRouteId);

  const cardRef = useRef<HTMLDivElement>(null);

  // Atualiza rota inicial se prop mudar
  useEffect(() => {
    if (initialRouteId) {
      setSelectedRouteId(initialRouteId);
    }
  }, [initialRouteId]);

  // Tecla Escape para fechar
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Bloqueio de scroll do fundo
  useEffect(() => {
    if (isOpen) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = origOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Lógica de dias do mês no calendário
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (
      calendarYear === today.getFullYear() &&
      calendarMonth <= today.getMonth()
    ) {
      return; // não volta para meses anteriores ao atual
    }
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  const isDateSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === calendarMonth &&
      selectedDate.getFullYear() === calendarYear
    );
  };

  const isPastDate = (day: number) => {
    const testDate = new Date(calendarYear, calendarMonth, day);
    testDate.setHours(0, 0, 0, 0);
    return testDate < today;
  };

  const handleSelectDay = (day: number) => {
    if (isPastDate(day)) return;
    const nextDate = new Date(calendarYear, calendarMonth, day);
    setSelectedDate(nextDate);
  };

  const formattedDateISO = selectedDate.toISOString().split("T")[0];

  const formattedDateDisplay = selectedDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const handleProceedToBooking = () => {
    const params = new URLSearchParams({
      data: formattedDateISO,
      adultos: adults.toString(),
      criancas: children.toString(),
      porDoSol: includeSunset ? "true" : "false",
      roteiro: selectedRouteId
    });

    onClose();
    router.push(`/agendamento?${params.toString()}`);
  };

  const selectedRoute =
    BOOKING_ROUTES.find((r) => r.id === selectedRouteId) || BOOKING_ROUTES[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-tour-title"
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden rounded-[2rem] bg-white text-slate-900 shadow-2xl border border-slate-100"
      >
        {/* Topo do Modal com Gradiente */}
        <div className="shrink-0 relative bg-gradient-to-r from-brand-deep via-[#0d3460] to-slate-900 px-6 py-5 sm:px-8 sm:py-6 text-white flex items-center justify-between border-b border-white/10">
          <div className="pr-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
              <span>🚤</span>
              <span>Planejamento Rápido</span>
            </div>
            <h2
              id="plan-tour-title"
              className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight"
            >
              Planeje seu Passeio de Lancha
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Escolha a data, número de passageiros e o roteiro dos sonhos pela Baía de Todos-os-Santos.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/15 focus:outline-none cursor-pointer"
            aria-label="Fechar modal de agendamento"
          >
            ✕
          </button>
        </div>

        {/* Corpo com Rolagem e 2 Colunas */}
        <div
          data-native-scroll="true"
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-6"
        >
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Lado Esquerdo: Calendário & Horário */}
            <div className="space-y-6">
              {/* 1. Calendário de Seleção */}
              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-brand-deep">
                        Selecione a Data do Passeio
                      </h3>
                      <p className="text-xs text-slate-500 capitalize">
                        {formattedDateDisplay}
                      </p>
                    </div>
                  </div>

                  {/* Controles de Navegação de Mês */}
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition cursor-pointer font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Mês anterior"
                    >
                      ‹
                    </button>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 px-2 min-w-[100px] text-center">
                      {MONTH_NAMES[calendarMonth]} {calendarYear}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition cursor-pointer font-bold"
                      aria-label="Próximo mês"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Grade dos Dias da Semana */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {WEEKDAY_NAMES.map((w) => (
                    <span
                      key={w}
                      className="text-[11px] font-bold text-slate-400 py-1 uppercase tracking-wider"
                    >
                      {w}
                    </span>
                  ))}
                </div>

                {/* Grade dos Dias do Mês */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                  {/* Espaços vazios antes do dia 1 */}
                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8 sm:h-9" />
                  ))}

                  {/* Dias do mês */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = isDateSelected(day);
                    const isPast = isPastDate(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isPast}
                        onClick={() => handleSelectDay(day)}
                        className={[
                          "h-8 sm:h-9 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center relative cursor-pointer",
                          isSelected
                            ? "bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-bold shadow-md scale-105"
                            : isPast
                            ? "text-slate-300 opacity-40 cursor-not-allowed"
                            : "text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 hover:font-bold"
                        ].join(" ")}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Duração e Opção do Pôr do Sol */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 space-y-3.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <h3 className="font-bold text-sm text-brand-deep">
                      Horário e Duração do Passeio
                    </h3>
                    <p className="text-xs text-slate-500">
                      Experiência de dia completo pelas enseadas e praias da Baía.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-900">
                        {includeSunset
                          ? "09:00h às 17:30h (com Pôr do Sol)"
                          : "09:00h às 16:00h (Horário Padrão)"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {includeSunset
                          ? "8h30 de navegação e paradas estendidas"
                          : "7 horas completas a bordo da lancha"}
                      </p>
                    </div>
                  </div>

                  {/* Checkbox Pôr do Sol */}
                  <label className="flex items-center gap-2.5 cursor-pointer bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 px-3 py-2 rounded-lg hover:border-amber-400 transition select-none">
                    <input
                      type="checkbox"
                      checked={includeSunset}
                      onChange={(e) => setIncludeSunset(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">🌅</span>
                      <span className="text-xs font-bold text-amber-900">
                        Incluir Pôr do Sol
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 3. Contadores de Passageiros */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">👥</span>
                  <div>
                    <h3 className="font-bold text-sm text-brand-deep">
                      Quantidade de Passageiros
                    </h3>
                    <p className="text-xs text-slate-500">
                      Capacidade confortável para famílias e grupos.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Adultos */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Adultos</p>
                      <p className="text-[10px] text-slate-500">12+ anos</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                        disabled={adults <= 1}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm text-slate-900 w-5 text-center">
                        {adults}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.min(16, prev + 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 cursor-pointer shadow-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Crianças */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Crianças</p>
                      <p className="text-[10px] text-slate-500">Até 11 anos</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                        disabled={children <= 0}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm text-slate-900 w-5 text-center">
                        {children}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.min(10, prev + 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 cursor-pointer shadow-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                  Total: <strong>{adults + children} passageiros</strong> a bordo (coletes salva-vidas homologados inclusos).
                </p>
              </div>
            </div>

            {/* Lado Direito: Seleção do Roteiro */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🗺️</span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-brand-deep">
                      Escolha o Roteiro
                    </h3>
                    <p className="text-xs text-slate-500">
                      Roteiros privativos exclusivos na Baía.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista dos Roteiros Disponíveis */}
              <div className="space-y-2.5">
                {BOOKING_ROUTES.map((route) => {
                  const isSelected = route.id === selectedRouteId;
                  return (
                    <div
                      key={route.id}
                      onClick={() => setSelectedRouteId(route.id)}
                      className={[
                        "group relative rounded-2xl p-3.5 sm:p-4 border transition-all cursor-pointer flex items-start gap-3.5",
                        isSelected
                          ? "bg-cyan-50/60 border-cyan-500 shadow-sm ring-2 ring-cyan-400/20"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                      ].join(" ")}
                    >
                      {/* Miniatura do Roteiro */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                        <Image
                          src={route.image}
                          alt={route.name}
                          fill
                          sizes="80px"
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-cyan-700 transition truncate">
                            {route.name}
                          </h4>
                          {route.badge && (
                            <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-200">
                              {route.badge}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                          {route.shortDescription}
                        </p>

                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-medium text-slate-600">
                            ⏱️ 7 horas de passeio
                          </span>
                          <span
                            className={[
                              "font-bold transition",
                              isSelected ? "text-cyan-600" : "text-slate-400"
                            ].join(" ")}
                          >
                            {isSelected ? "● Selecionado" : "○ Escolher"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card Resumo do Roteiro Ativo */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-deep to-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                  <span>Roteiro Ativo:</span>
                  <span>{selectedRoute.badge || "Exclusivo"}</span>
                </div>
                <h4 className="font-bold text-sm text-white">
                  {selectedRoute.name}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {selectedRoute.tagline}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé Fixo com Botão de Avanço */}
        <div className="shrink-0 p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-xs text-slate-500">
              Resumo: <strong className="text-slate-900">{selectedRoute.name}</strong> • {formattedDateDisplay}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {adults + children} passageiros • {includeSunset ? "Com Pôr do Sol" : "Horário padrão"}
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex px-5 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleProceedToBooking}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-bold text-sm transition shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Avançar para Detalhes e Reserva</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
