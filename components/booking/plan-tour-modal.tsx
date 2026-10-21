"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BOOKING_ROUTES, type BookingRouteOption } from "@/data/booking";
import { useSiteContent } from "@/lib/use-site-content";
import {
  evaluateRouteTideCompatibility,
  getDayTideEvaluation
} from "@/lib/tide-engine";
import { PlanTourWeather } from "./plan-tour-weather";
import { TideWarningDialog } from "./tide-warning-dialog";

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
  initialRouteId = "roteiro-1"
}: PlanTourModalProps) {
  const router = useRouter();
  const { content } = useSiteContent();

  // Lista dinâmica de roteiros (prioriza os configurados no CMS/painel admin)
  const routesList: BookingRouteOption[] = useMemo(() => {
    if (content?.routes?.bookingRoutes && content.routes.bookingRoutes.length > 0) {
      return content.routes.bookingRoutes;
    }
    return BOOKING_ROUTES;
  }, [content]);

  // Data hoje
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  // Amanhã como default para permitir planejamento
  const defaultDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d;
  }, [today]);

  // Estados do formulário rápido
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [calendarMonth, setCalendarMonth] = useState<number>(today.getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(today.getFullYear());

  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [includeSunset, setIncludeSunset] = useState<boolean>(false);

  // Resolução segura de ID de rota
  const normalizeRouteId = (id: string, list: BookingRouteOption[]): string => {
    if (list.some((r) => r.id === id || r.slug === id)) {
      const match = list.find((r) => r.id === id || r.slug === id);
      return match ? match.id : id;
    }
    // Compatibilidade com slugs legados
    if (id === "ilha-dos-frades-guadalupe") return "roteiro-1";
    if (id === "bom-jesus-dos-passos") return "roteiro-2";
    if (id === "coroa-do-frade-bancos-de-areia") return "roteiro-3";
    if (id === "volta-completa-nas-ilhas") return "roteiro-4";
    return list[0]?.id || "roteiro-1";
  };

  const [selectedRouteId, setSelectedRouteId] = useState<string>(() =>
    normalizeRouteId(initialRouteId, routesList)
  );

  // Estado para o Alert de confirmação de maré não favorável
  const [warningRoute, setWarningRoute] = useState<BookingRouteOption | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  // Atualiza rota inicial se prop ou lista mudar
  useEffect(() => {
    if (initialRouteId) {
      setSelectedRouteId(normalizeRouteId(initialRouteId, routesList));
    }
  }, [initialRouteId, routesList]);

  // Tecla Escape para fechar
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (warningRoute) {
          setWarningRoute(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, warningRoute]);

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

  // Sincroniza o modal com os dados atuais da página /agendamento ao abrir
  useEffect(() => {
    if (!isOpen) return;

    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const urlDate = sp.get("data");
      const urlAdults = sp.get("adultos");
      const urlChildren = sp.get("criancas");
      const urlSunset = sp.get("porDoSol");
      const urlRoute = sp.get("roteiro");

      if (urlDate) {
        const parts = urlDate.split("-");
        if (parts.length === 3) {
          const parsed = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          if (!isNaN(parsed.getTime())) {
            setSelectedDate(parsed);
            setCalendarMonth(parsed.getMonth());
            setCalendarYear(parsed.getFullYear());
          }
        }
      }
      if (urlAdults) setAdults(Math.max(1, Number(urlAdults) || 2));
      if (urlChildren !== null && urlChildren !== undefined && urlChildren !== "") {
        setChildren(Math.max(0, Number(urlChildren) || 0));
      }
      if (urlSunset !== null) setIncludeSunset(urlSunset === "true");
      if (urlRoute) setSelectedRouteId(normalizeRouteId(urlRoute, routesList));
    }
  }, [isOpen, routesList]);

  if (!isOpen) return null;

  // Lógica de dias do mês no calendário
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (
      calendarYear === today.getFullYear() &&
      calendarMonth <= today.getMonth()
    ) {
      return;
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

  // Função para transmitir as seleções do modal para a página /agendamento
  const emitSync = (updates: {
    date?: Date;
    adults?: number;
    children?: number;
    includeSunset?: boolean;
    routeId?: string;
  }) => {
    if (typeof window === "undefined") return;

    const targetDate = updates.date || selectedDate;
    const targetDateISO = targetDate.toISOString().split("T")[0];
    const targetAdults = updates.adults !== undefined ? updates.adults : adults;
    const targetChildren = updates.children !== undefined ? updates.children : children;
    const targetSunset =
      updates.includeSunset !== undefined ? updates.includeSunset : includeSunset;
    const targetRouteId = updates.routeId !== undefined ? updates.routeId : selectedRouteId;

    window.dispatchEvent(
      new CustomEvent("entreasilhas:sync-tour-plan", {
        detail: {
          date: targetDate,
          dateISO: targetDateISO,
          adults: targetAdults,
          children: targetChildren,
          includeSunset: targetSunset,
          routeId: targetRouteId
        }
      })
    );

    if (window.location.pathname.includes("/agendamento")) {
      const params = new URLSearchParams(window.location.search);
      params.set("data", targetDateISO);
      params.set("adultos", targetAdults.toString());
      params.set("criancas", targetChildren.toString());
      params.set("porDoSol", targetSunset ? "true" : "false");
      params.set("roteiro", targetRouteId);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);
    }
  };

  const handleSelectDay = (day: number) => {
    if (isPastDate(day)) return;
    const nextDate = new Date(calendarYear, calendarMonth, day);
    setSelectedDate(nextDate);
    emitSync({ date: nextDate });
  };

  const formattedDateISO = selectedDate.toISOString().split("T")[0];

  const formattedDateDisplay = selectedDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Avaliação da maré para a data selecionada
  const dayTideEval = getDayTideEvaluation(selectedDate);

  // Ação ao clicar em um roteiro
  const handleRouteClick = (route: BookingRouteOption) => {
    const tideStatus = evaluateRouteTideCompatibility(
      route.bestTides,
      selectedDate,
      route.name,
      route.id
    );

    if (!tideStatus.isFavorable) {
      // Abre alert no centro da tela perguntando se tem certeza
      setWarningRoute(route);
    } else {
      // Maré favorável: seleciona imediatamente e sincroniza
      setSelectedRouteId(route.id);
      emitSync({ routeId: route.id });
    }
  };

  // Confirmação no Alert: Botão "Sim"
  const handleConfirmWarning = () => {
    if (warningRoute) {
      setSelectedRouteId(warningRoute.id);
      emitSync({ routeId: warningRoute.id });
      setWarningRoute(null);
    }
  };

  // Rejeição no Alert: Botão "Não"
  const handleCancelWarning = () => {
    if (warningRoute && selectedRouteId === warningRoute.id) {
      const firstFavorable = routesList.find(
        (r) => evaluateRouteTideCompatibility(r.bestTides, selectedDate, r.name, r.id).isFavorable
      );
      if (firstFavorable) {
        setSelectedRouteId(firstFavorable.id);
        emitSync({ routeId: firstFavorable.id });
      }
    }
    setWarningRoute(null);
  };

  const handleProceedToBooking = () => {
    const params = new URLSearchParams({
      data: formattedDateISO,
      adultos: adults.toString(),
      criancas: children.toString(),
      porDoSol: includeSunset ? "true" : "false",
      roteiro: selectedRouteId
    });

    emitSync({
      date: selectedDate,
      adults,
      children,
      includeSunset,
      routeId: selectedRouteId
    });

    onClose();

    if (typeof window !== "undefined" && window.location.pathname.includes("/agendamento")) {
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);
    } else {
      router.push(`/agendamento?${params.toString()}`);
    }
  };

  const selectedRoute =
    routesList.find((r) => r.id === selectedRouteId) || routesList[0] || BOOKING_ROUTES[0];

  const activeRouteTideStatus = evaluateRouteTideCompatibility(
    selectedRoute.bestTides,
    selectedDate,
    selectedRoute.name,
    selectedRoute.id
  );

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-tour-title"
      >
        <div
          ref={cardRef}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl xl:max-w-7xl max-h-[94vh] flex flex-col overflow-hidden rounded-[2rem] bg-white text-slate-900 shadow-2xl border border-slate-100"
        >
          {/* Topo do Modal com Gradiente */}
          <div className="shrink-0 relative bg-gradient-to-r from-brand-deep via-[#0d3460] to-slate-900 px-5 py-4 sm:px-8 sm:py-5 text-white flex items-center justify-between border-b border-white/10">
            <div className="pr-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                <span>🚤</span>
                <span>Planejamento Rápido</span>
              </div>
              <h2
                id="plan-tour-title"
                className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight"
              >
                Planeje seu Passeio de Lancha
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed hidden sm:block">
                Roteiros e calendário sincronizados com a tábua de marés local de Madre de Deus.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/15 focus:outline-none cursor-pointer shrink-0"
              aria-label="Fechar modal de agendamento"
            >
              ✕
            </button>
          </div>

          {/* Corpo com Rolagem e 2 Colunas Espaçosas */}
          <div
            data-native-scroll="true"
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-7 space-y-6"
          >
            <div className="grid gap-6 lg:gap-8 lg:grid-cols-[410px_1fr] xl:grid-cols-[440px_1fr]">
              {/* Lado Esquerdo: Calendário & Controles */}
              <div className="space-y-5">
                {/* 1. Calendário de Seleção */}
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📅</span>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-brand-deep">
                          Data do Passeio
                        </h3>
                        <p className="text-xs text-slate-500 capitalize">
                          {formattedDateDisplay}
                        </p>
                      </div>
                    </div>

                    {/* Controles de Navegação de Mês */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition cursor-pointer font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Mês anterior"
                      >
                        ‹
                      </button>
                      <span className="text-xs font-bold text-slate-800 px-2 min-w-[95px] text-center">
                        {MONTH_NAMES[calendarMonth]} {calendarYear}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition cursor-pointer font-bold"
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
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-8 sm:h-9" />
                    ))}

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

                  {/* Indicador de sincronização com a tábua de maré */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span>🌊</span>
                      <span>Maré ao meio-dia:</span>
                      <strong className="text-brand-deep font-bold">{dayTideEval.middayPhase.name}</strong>
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">Madre de Deus</span>
                  </div>
                </div>

                {/* 2. Duração e Opção do Pôr do Sol */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏱️</span>
                    <div>
                      <h3 className="font-bold text-sm text-brand-deep">
                        Horário e Duração
                      </h3>
                      <p className="text-xs text-slate-500">
                        Passeio exclusivo de dia completo.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                          {includeSunset
                            ? "09:00h às 17:30h (Com Pôr do Sol)"
                            : "09:00h às 16:00h (Horário Padrão)"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {includeSunset
                            ? "8h30 de passeio com paradas estendidas"
                            : "7 horas completas a bordo"}
                        </p>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 px-3 py-2 rounded-xl hover:border-amber-400 transition select-none shrink-0">
                      <input
                        type="checkbox"
                        checked={includeSunset}
                        onChange={(e) => {
                          const next = e.target.checked;
                          setIncludeSunset(next);
                          emitSync({ includeSunset: next });
                        }}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                      />
                      <span className="text-sm">🌅</span>
                      <span className="text-xs font-bold text-amber-900">
                        Incluir Pôr do Sol
                      </span>
                    </label>
                  </div>
                </div>

                {/* 3. Contadores de Passageiros (Sem vazamento de botões) */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👥</span>
                    <div>
                      <h3 className="font-bold text-sm text-brand-deep">
                        Quantidade de Passageiros
                      </h3>
                      <p className="text-xs text-slate-500">
                        Capacidade segura e confortável para seu grupo.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Adultos */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900">Adultos</p>
                        <p className="text-[11px] text-slate-500">A partir de 12 anos</p>
                      </div>

                      <div className="inline-flex items-center bg-white border border-slate-200/90 rounded-xl p-1 shadow-2xs shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const next = Math.max(1, adults - 1);
                            setAdults(next);
                            emitSync({ adults: next });
                          }}
                          disabled={adults <= 1}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-base transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                          aria-label="Diminuir adultos"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-extrabold text-sm text-slate-900 select-none">
                          {adults}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = Math.min(16, adults + 1);
                            setAdults(next);
                            emitSync({ adults: next });
                          }}
                          className="w-8 h-8 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center font-bold text-base transition cursor-pointer active:scale-95 shadow-2xs"
                          aria-label="Aumentar adultos"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Crianças */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900">Crianças</p>
                        <p className="text-[11px] text-slate-500">Até 11 anos</p>
                      </div>

                      <div className="inline-flex items-center bg-white border border-slate-200/90 rounded-xl p-1 shadow-2xs shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const next = Math.max(0, children - 1);
                            setChildren(next);
                            emitSync({ children: next });
                          }}
                          disabled={children <= 0}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-base transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                          aria-label="Diminuir crianças"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-extrabold text-sm text-slate-900 select-none">
                          {children}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = Math.min(10, children + 1);
                            setChildren(next);
                            emitSync({ children: next });
                          }}
                          className="w-8 h-8 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center font-bold text-base transition cursor-pointer active:scale-95 shadow-2xs"
                          aria-label="Aumentar crianças"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    Total: <strong className="text-slate-900">{adults + children} passageiros</strong> a bordo.
                  </p>
                </div>

                {/* 4. Seção Weather (meteorologia + vento + tábua de marés da BTS) - Posicionada embaixo de Passageiros */}
                <PlanTourWeather
                  selectedDate={selectedDate}
                  includeSunset={includeSunset}
                />
              </div>

              {/* Lado Direito: Seleção do Roteiro (Arejado e Sem Amontoados) */}
              <div className="space-y-5">
                <div className="space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🗺️</span>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-brand-deep">
                          Roteiros Disponíveis
                        </h3>
                        <p className="text-xs text-slate-500">
                          Selecione o roteiro desejado para navegar pelas ilhas.
                        </p>
                      </div>
                    </div>

                    {/* Badge da Maré Geral da Data */}
                    <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-100/90 text-cyan-900 border border-cyan-300">
                      <span>🌊</span>
                      <span>Maré ao Meio-dia: {dayTideEval.middayPhase.shortLabel}</span>
                    </span>
                  </div>

                  {/* Banner Explicativo sobre a Maré Local */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-50 border border-cyan-200/80 text-xs text-slate-700 flex items-start gap-3 shadow-2xs">
                    <span className="text-xl shrink-0 mt-0.5">🧭</span>
                    <p className="leading-relaxed">
                      Na data selecionada, a maré durante o passeio estará como{" "}
                      <strong className="text-brand-deep">{dayTideEval.middayPhase.name}</strong>. Roteiros com condições ideais de maré estão habilitados e destacados. Roteiros com praias ou piscinas desfavoráveis ficam esmaecidos.
                    </p>
                  </div>

                  {/* Lista dos Roteiros Disponíveis (Design Amplo e Limpo) */}
                  <div className="space-y-3.5">
                    {routesList.map((route) => {
                      const isSelected = route.id === selectedRouteId;
                      const tideStatus = evaluateRouteTideCompatibility(
                        route.bestTides,
                        selectedDate,
                        route.name,
                        route.id
                      );
                      const isFavorable = tideStatus.isFavorable;

                      return (
                        <div
                          key={route.id}
                          onClick={() => handleRouteClick(route)}
                          className={[
                            "group relative rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer overflow-hidden",
                            // Estado selecionado
                            isSelected && isFavorable
                              ? "bg-cyan-50/80 border-cyan-500 shadow-md ring-2 ring-cyan-400/30"
                              : isSelected && !isFavorable
                              ? "bg-slate-800/10 border-amber-400 shadow-md ring-2 ring-amber-400/30"
                              // Estado não favorável (Área escura/desativada conforme solicitação)
                              : !isFavorable
                              ? "bg-slate-100/90 border-slate-300 text-slate-600 hover:bg-slate-200/80"
                              // Estado normal ativo
                              : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70 shadow-xs"
                          ].join(" ")}
                        >
                          {/* Camada escura que cobre toda a área do retângulo quando a maré não está favorável */}
                          {!isFavorable && (
                            <div
                              className="absolute inset-0 bg-slate-950/20 backdrop-saturate-50 pointer-events-none rounded-2xl z-10"
                              aria-hidden="true"
                            />
                          )}

                          <div className="relative z-10 space-y-3.5 w-full">
                            {/* 1. Barra Superior do Card: Badge do Roteiro à Esquerda + Status da Maré à Direita */}
                            <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                              <div className="flex items-center gap-2">
                                {route.badge ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-200">
                                    {route.badge}
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                                    Roteiro Exclusivo
                                  </span>
                                )}
                                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">⏱️ 7h de passeio</span>
                              </div>

                              {/* Badge de Maré */}
                              {isFavorable ? (
                                <span
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs shrink-0"
                                  title={`Maré favorável: ${route.bestTidesLabel}`}
                                >
                                  <span>✓</span>
                                  <span>Maré Favorável</span>
                                </span>
                              ) : (
                                <span
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs shrink-0"
                                  title={`Maré não favorável nesta data (${tideStatus.currentTide.name}). Melhor com: ${route.bestTidesLabel}`}
                                >
                                  <span>⚠️</span>
                                  <span>Maré Desfavorável</span>
                                </span>
                              )}
                            </div>

                            {/* 2. Linha Principal: Miniatura + Título e Descrição com 100% da largura horizontal disponível */}
                            <div className="flex items-start gap-3.5 sm:gap-4">
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200 shadow-2xs mt-0.5">
                                <Image
                                  src={route.image}
                                  alt={route.name}
                                  fill
                                  sizes="80px"
                                  className={[
                                    "object-cover transition duration-300 group-hover:scale-105",
                                    !isFavorable ? "opacity-75 contrast-90" : ""
                                  ].join(" ")}
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <h4
                                  className={[
                                    "font-extrabold text-base sm:text-lg leading-tight tracking-tight",
                                    isSelected
                                      ? "text-brand-deep font-black"
                                      : !isFavorable
                                      ? "text-slate-800"
                                      : "text-slate-900 group-hover:text-cyan-700"
                                  ].join(" ")}
                                >
                                  {route.name}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1">
                                  {route.shortDescription}
                                </p>
                              </div>
                            </div>

                            {/* Aviso específico de maré ou parada para o roteiro */}
                            {tideStatus.specificNotice && (
                              <div className="p-2.5 rounded-xl bg-sky-50/90 border border-sky-200/80 text-[11px] text-sky-950 font-medium leading-relaxed">
                                {tideStatus.specificNotice}
                              </div>
                            )}

                            {/* 3. Paradas Principais em lista legível sem amontoados */}
                            {route.stops && route.stops.length > 0 && (
                              <div className="pt-2 border-t border-slate-200/70">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                                  Paradas Programadas:
                                </span>
                                <div className="space-y-1.5">
                                  {route.stops.map((stop, sIdx) => (
                                    <div
                                      key={sIdx}
                                      className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50/90 px-2.5 py-1.5 rounded-lg border border-slate-200/60 leading-snug"
                                    >
                                      <span className="text-cyan-600 font-bold shrink-0 mt-0.5">•</span>
                                      <span>{stop}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 4. Rodapé do Card: Duração, Maré e Estado de Seleção */}
                            <div className="pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <span className="text-slate-500 text-[11px]">
                                Melhor maré: <strong className="text-slate-700">{route.bestTidesLabel}</strong>
                              </span>

                              <span
                                className={[
                                  "font-bold text-xs transition",
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
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-deep to-slate-900 text-white space-y-3 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold">
                      <span className="text-cyan-300">Roteiro Ativo:</span>
                      <span
                        className={[
                          "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider self-start sm:self-auto",
                          activeRouteTideStatus.isFavorable
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                            : "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                        ].join(" ")}
                      >
                        {activeRouteTideStatus.isFavorable
                          ? "✓ Maré Favorável na Data"
                          : "⚠️ Maré Desfavorável na Data"}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                        {selectedRoute.name}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">
                        {selectedRoute.tagline}
                      </p>
                    </div>

                    {activeRouteTideStatus.specificNotice && (
                      <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-cyan-200 leading-relaxed">
                        {activeRouteTideStatus.specificNotice}
                      </div>
                    )}

                    <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                      <span>
                        Condição ideal: <strong>{selectedRoute.bestTidesLabel}</strong>
                      </span>
                      <span className="text-cyan-300 font-medium">Madre de Deus • BTS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé Fixo com Botão de Avanço */}
          <div className="shrink-0 p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-xs text-slate-500">
                Resumo: <strong className="text-slate-900">{selectedRoute.name}</strong> • {formattedDateDisplay}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {adults + children} passageiros • {includeSunset ? "Com Pôr do Sol" : "Horário padrão"} • Maré:{" "}
                <span className={activeRouteTideStatus.isFavorable ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                  {activeRouteTideStatus.statusLabel}
                </span>
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

      {/* Modal / Alert de Confirmação no Centro da Tela para Maré Não Favorável */}
      <TideWarningDialog
        isOpen={Boolean(warningRoute)}
        route={warningRoute}
        selectedDate={selectedDate}
        onConfirm={handleConfirmWarning}
        onCancel={handleCancelWarning}
      />
    </>
  );
}
