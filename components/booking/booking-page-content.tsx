"use client";

import { useSearchParams } from "next/navigation";
import { useState, useId, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BOOKING_ROUTES,
  LUNCH_PREFERENCES,
  PAYMENT_METHODS,
  INCLUDED_AMENITIES,
  type BookingRouteOption
} from "@/data/booking";
import { useSiteContent } from "@/lib/use-site-content";
import {
  evaluateRouteTideCompatibility,
  getDayTideEvaluation
} from "@/lib/tide-engine";
import { PlanTourWeather } from "./plan-tour-weather";
import { TideWarningDialog } from "./tide-warning-dialog";

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

export function BookingPageContent() {
  const searchParams = useSearchParams();
  const { content } = useSiteContent();

  const routesList: BookingRouteOption[] = useMemo(() => {
    if (content?.routes?.bookingRoutes && content.routes.bookingRoutes.length > 0) {
      return content.routes.bookingRoutes;
    }
    return BOOKING_ROUTES;
  }, [content]);

  // Parse dos parâmetros vindos do modal ou link
  const paramDate = searchParams?.get("data");
  const paramAdults = Number(searchParams?.get("adultos")) || 2;
  const paramChildren = Number(searchParams?.get("criancas")) || 0;
  const paramSunset = searchParams?.get("porDoSol") === "true";
  const paramRoute = searchParams?.get("roteiro") || "roteiro-1";

  const normalizeRouteId = (id: string, list: BookingRouteOption[]): string => {
    if (list.some((r) => r.id === id || r.slug === id)) {
      const match = list.find((r) => r.id === id || r.slug === id);
      return match ? match.id : id;
    }
    if (id === "ilha-dos-frades-guadalupe") return "roteiro-1";
    if (id === "bom-jesus-dos-passos") return "roteiro-2";
    if (id === "coroa-do-frade-bancos-de-areia") return "roteiro-3";
    if (id === "volta-completa-nas-ilhas") return "roteiro-4";
    return list[0]?.id || "roteiro-1";
  };

  // Data inicial segura
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let initialDate = new Date(today);
  initialDate.setDate(initialDate.getDate() + 1);

  if (paramDate) {
    const parts = paramDate.split("-");
    if (parts.length === 3) {
      const parsed = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
      );
      if (!isNaN(parsed.getTime()) && parsed >= today) {
        initialDate = parsed;
      }
    }
  }

  // Estados Básicos (preenchidos e editáveis)
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [calendarMonth, setCalendarMonth] = useState<number>(initialDate.getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(initialDate.getFullYear());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [adults, setAdults] = useState<number>(Math.max(1, paramAdults));
  const [children, setChildren] = useState<number>(Math.max(0, paramChildren));
  const [includeSunset, setIncludeSunset] = useState<boolean>(paramSunset);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(() =>
    normalizeRouteId(paramRoute, routesList)
  );

  // Estado para alert/modal de maré não favorável
  const [warningRoute, setWarningRoute] = useState<BookingRouteOption | null>(null);

  // Estados Completos
  const [lunchPreference, setLunchPreference] = useState<"restaurante" | "churrasqueira" | "proprio">("restaurante");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cartao" | "whatsapp">("pix");

  // Dados do Cliente
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // UI Popover do CPF
  const [showCpfTooltip, setShowCpfTooltip] = useState(false);

  // Estados de Envio e Sucesso
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBookingCode, setSubmittedBookingCode] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const formId = useId();

  // Roteiro ativo
  const currentRoute: BookingRouteOption =
    routesList.find((r) => r.id === selectedRouteId) || routesList[0] || BOOKING_ROUTES[0];

  // Avaliação da maré da data
  const dayTideEval = getDayTideEvaluation(selectedDate);
  const currentRouteTideStatus = evaluateRouteTideCompatibility(
    currentRoute.bestTides,
    selectedDate,
    currentRoute.name,
    currentRoute.id
  );

  // Ações de seleção de rota e confirmação no alert de maré
  const handleRouteClick = (route: BookingRouteOption) => {
    const tideStatus = evaluateRouteTideCompatibility(
      route.bestTides,
      selectedDate,
      route.name,
      route.id
    );
    if (!tideStatus.isFavorable) {
      setWarningRoute(route);
    } else {
      setSelectedRouteId(route.id);
    }
  };

  const handleConfirmWarning = () => {
    if (warningRoute) {
      setSelectedRouteId(warningRoute.id);
      setWarningRoute(null);
    }
  };

  const handleCancelWarning = () => {
    if (warningRoute && selectedRouteId === warningRoute.id) {
      const firstFavorable = routesList.find(
        (r) => evaluateRouteTideCompatibility(r.bestTides, selectedDate, r.name, r.id).isFavorable
      );
      if (firstFavorable) {
        setSelectedRouteId(firstFavorable.id);
      }
    }
    setWarningRoute(null);
  };

  // 1. Sincronização em tempo real quando o usuário altera opções no modal "Planejar passeio"
  useEffect(() => {
    const handleSyncTourPlan = (e: Event) => {
      const customEvent = e as CustomEvent<{
        date?: Date;
        dateISO?: string;
        adults?: number;
        children?: number;
        includeSunset?: boolean;
        routeId?: string;
      }>;
      if (!customEvent.detail) return;
      const {
        date,
        adults: nextAdults,
        children: nextChildren,
        includeSunset: nextSunset,
        routeId
      } = customEvent.detail;

      if (date && date instanceof Date && !isNaN(date.getTime())) {
        setSelectedDate(date);
        setCalendarMonth(date.getMonth());
        setCalendarYear(date.getFullYear());
      }
      if (typeof nextAdults === "number") {
        setAdults(Math.max(1, nextAdults));
      }
      if (typeof nextChildren === "number") {
        setChildren(Math.max(0, nextChildren));
      }
      if (typeof nextSunset === "boolean") {
        setIncludeSunset(nextSunset);
      }
      if (routeId) {
        setSelectedRouteId(normalizeRouteId(routeId, routesList));
      }
    };

    window.addEventListener("entreasilhas:sync-tour-plan", handleSyncTourPlan);
    return () => {
      window.removeEventListener("entreasilhas:sync-tour-plan", handleSyncTourPlan);
    };
  }, [routesList]);

  // 2. Mantém a URL sincronizada para que, se o modal abrir a qualquer momento, ele já comece com os valores atuais da página
  useEffect(() => {
    if (typeof window === "undefined") return;
    const dateISO = selectedDate.toISOString().split("T")[0];
    const params = new URLSearchParams(window.location.search);
    params.set("data", dateISO);
    params.set("adultos", adults.toString());
    params.set("criancas", children.toString());
    params.set("porDoSol", includeSunset ? "true" : "false");
    params.set("roteiro", selectedRouteId);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [selectedDate, adults, children, includeSunset, selectedRouteId]);

  // Formatação de Máscaras
  const handleCpfChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 9) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    } else if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    setCpf(formatted);
  };

  const handleTelefoneChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 10) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 6) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    setTelefone(formatted);
  };

  // Calendário
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();

  const isPastDate = (day: number) => {
    const testDate = new Date(calendarYear, calendarMonth, day);
    testDate.setHours(0, 0, 0, 0);
    return testDate < today;
  };

  const isDateSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === calendarMonth &&
      selectedDate.getFullYear() === calendarYear
    );
  };

  const formattedDateDisplay = selectedDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const formattedDateShort = selectedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  // Submissão do Formulário de Agendamento
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!nome.trim() || nome.trim().length < 3) {
      setValidationError("Por favor, preencha seu nome completo.");
      return;
    }

    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      setValidationError("Por favor, digite um CPF válido com 11 dígitos.");
      return;
    }

    const cleanTel = telefone.replace(/\D/g, "");
    if (cleanTel.length < 10) {
      setValidationError("Por favor, preencha um telefone/WhatsApp válido com DDD.");
      return;
    }

    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      setValidationError("Por favor, preencha um endereço de e-mail válido.");
      return;
    }

    setIsSubmitting(true);

    // Gerar código de reserva exclusivo
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `EAI-${new Date().getFullYear()}-${randomCode}`;

    // Salva a reserva no backend de agendamentos
    try {
      fetch("/api/bookings/public-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: bookingCode,
          nome: nome.trim(),
          cpf: cpf.trim(),
          telefone: telefone.trim(),
          email: email.trim(),
          observacoes: observacoes.trim(),
          data: selectedDate.toISOString().split("T")[0],
          horario: includeSunset ? "09:00h às 17:30h (Com Pôr do Sol)" : "09:00h às 16:00h (Padrão)",
          roteiroNome: currentRoute.name,
          roteiroSlug: currentRoute.slug,
          adults,
          children,
          includeSunset,
          lunchPreference: selectedLunchObj?.title || lunchPreference,
          paymentMethod
        })
      }).catch(() => {});
    } catch {
      // Ignora erro de rede em background
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedBookingCode(bookingCode);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  // Mensagem pré-formatada para o WhatsApp
  const selectedLunchObj = LUNCH_PREFERENCES.find((l) => l.id === lunchPreference);
  const selectedPaymentObj = PAYMENT_METHODS.find((p) => p.id === paymentMethod);

  const whatsappMessage = `🛥️ *SOLICITAÇÃO DE AGENDAMENTO — ENTRE AS ILHAS*
Reserva: *#${submittedBookingCode || "NOVA"}*

*DETALHES DO PASSEIO:*
• *Roteiro:* ${currentRoute.name}
• *Data:* ${formattedDateDisplay}
• *Horário:* ${includeSunset ? "09:00h às 17:30h (Com Pôr do Sol)" : "09:00h às 16:00h (Padrão)"}
• *Passageiros:* ${adults} adulto(s)${children > 0 ? ` e ${children} criança(s)` : ""} (Total: ${adults + children})
• *Almoço:* ${selectedLunchObj?.title || lunchPreference}
• *Forma de Pagamento:* ${selectedPaymentObj?.title || paymentMethod}

*DADOS DO TITULAR (CHARTER):*
• *Nome:* ${nome}
• *CPF:* ${cpf}
• *WhatsApp:* ${telefone}
• *E-mail:* ${email}
${observacoes ? `• *Observações:* ${observacoes}` : ""}

Olá equipe Entre as Ilhas! Acabei de preencher o agendamento no site e gostaria de formalizar a reserva e o contrato de afretamento.`;

  const whatsappUrl = `https://wa.me/5571992517102?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 sm:pt-32 sm:pb-28">
      <div className="mx-auto w-full max-w-7xl xl:max-w-[1420px] 2xl:max-w-[1520px] px-4 sm:px-6 lg:px-8">
        {/* Banner de Título */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-300 text-cyan-900 text-xs font-bold uppercase tracking-wider mb-3">
            <span>⚓</span>
            <span>Sistema Oficial de Agendamento</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-deep leading-[1.08]">
            Agendamento de Passeio Náutico
          </h1>

          <p className="mt-2.5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
            Personalize seu roteiro, selecione a preferência de almoço e garanta o afretamento exclusivo da sua lancha na Baía de Todos-os-Santos.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("entreasilhas:open-plan-tour-modal"));
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition cursor-pointer active:scale-95"
            >
              <span>🧭</span>
              <span>Planejar passeio (Assistente com Tábua de Marés)</span>
            </button>
          </div>
        </div>

        {/* Estado de Sucesso / Confirmação */}
        {submittedBookingCode ? (
          <div className="rounded-[2.5rem] bg-white border border-emerald-500/30 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl shadow-inner animate-bounce">
                ✓
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Solicitação Registrada com Sucesso
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-deep">
                Reserva <span className="text-emerald-600">#{submittedBookingCode}</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Olá, <strong>{nome}</strong>! Sua solicitação de passeio para <strong>{formattedDateDisplay}</strong> foi processada. Para validar a disponibilidade imediata e assinar digitalmente o Charter da embarcação, envie seu resumo para nossa equipe:
              </p>
            </div>

            {/* Cartão de Resumo Oficial */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-5 sm:p-7 max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Roteiro Escolhido
                </span>
                <span className="font-bold text-brand-deep text-sm sm:text-base">
                  {currentRoute.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm border-b border-slate-200 pb-3">
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase">Data:</span>
                  <span className="font-semibold text-slate-900">{formattedDateShort}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase">Horário:</span>
                  <span className="font-semibold text-slate-900">
                    {includeSunset ? "09:00h às 17:30h (Pôr do Sol)" : "09:00h às 16:00h"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase">Passageiros:</span>
                  <span className="font-semibold text-slate-900">
                    {adults} adulto(s){children > 0 ? `, ${children} criança(s)` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] uppercase">Almoço:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedLunchObj?.title}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p><strong>Titular da Reserva:</strong> {nome} (CPF: {cpf})</p>
                <p><strong>Contato:</strong> {telefone} • {email}</p>
                <p><strong>Forma de Pagamento:</strong> {selectedPaymentObj?.title}</p>
              </div>
            </div>

            {/* Ações de Finalização */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 text-base transition shadow-xl hover:scale-105 active:scale-95"
              >
                <span>Enviar pelo WhatsApp Oficial</span>
                <span className="text-xl">💬</span>
              </a>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white hover:bg-slate-100 text-slate-700 font-semibold px-6 py-4 text-sm transition border border-slate-200 text-center"
              >
                Voltar à Página Inicial
              </Link>
            </div>
          </div>
        ) : (
          /* Formulário Principal em 2 Colunas Arejadas */
          <form onSubmit={handleSubmitBooking} className="grid gap-8 lg:grid-cols-[1fr_390px] xl:grid-cols-[1fr_420px]">
            {/* Coluna da Esquerda: Etapas do Formulário */}
            <div className="space-y-8">
              {/* ETAPA 1: Configurações Básicas do Passeio */}
              <section className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-soft space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="w-8 h-8 rounded-full bg-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    1
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-brand-deep">
                      Configuração do Passeio
                    </h2>
                    <p className="text-xs text-slate-500">
                      Revise ou altere a data, horário e quantidade de passageiros.
                    </p>
                  </div>
                </div>

                {/* Data e Calendário Dropdown */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Data Selecionada:
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="font-bold text-sm text-slate-900 capitalize">
                          {formattedDateDisplay}
                        </p>
                        <p className="text-xs text-slate-500">
                          {isDateSelected(today.getDate() + 1)
                            ? "Data sugerida para agendamento"
                            : "Data confirmada para o passeio"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            window.dispatchEvent(new CustomEvent("entreasilhas:open-plan-tour-modal"));
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-xs border border-cyan-200 shadow-2xs transition cursor-pointer"
                        title="Abrir modal Planejar passeio"
                      >
                        🧭 Planejar passeio
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition cursor-pointer"
                      >
                        {isCalendarOpen ? "Ocultar Calendário" : "Alterar Data"}
                      </button>
                    </div>
                  </div>

                  {/* Calendário Expansível */}
                  {isCalendarOpen && (
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-md animate-fadeIn">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            if (calendarMonth === 0) {
                              setCalendarMonth(11);
                              setCalendarYear((prev) => prev - 1);
                            } else {
                              setCalendarMonth((prev) => prev - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 font-bold cursor-pointer"
                        >
                          ‹
                        </button>
                        <span className="font-bold text-sm text-brand-deep">
                          {MONTH_NAMES[calendarMonth]} {calendarYear}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (calendarMonth === 11) {
                              setCalendarMonth(0);
                              setCalendarYear((prev) => prev + 1);
                            } else {
                              setCalendarMonth((prev) => prev + 1);
                            }
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 font-bold cursor-pointer"
                        >
                          ›
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center mb-1">
                        {WEEKDAY_NAMES.map((w) => (
                          <span key={w} className="text-[10px] font-bold text-slate-400 uppercase">
                            {w}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDayIndex }).map((_, i) => (
                          <div key={`empty-${i}`} className="h-8" />
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
                              onClick={() => {
                                if (isPast) return;
                                setSelectedDate(new Date(calendarYear, calendarMonth, day));
                                setIsCalendarOpen(false);
                              }}
                              className={[
                                "h-8 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center",
                                isSelected
                                  ? "bg-cyan-500 text-white font-bold"
                                  : isPast
                                  ? "text-slate-300 opacity-40 cursor-not-allowed"
                                  : "text-slate-700 hover:bg-cyan-50"
                              ].join(" ")}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Horário & Checkbox Pôr do Sol */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Horário do Passeio:
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {includeSunset
                          ? "09:00h às 17:30h (Duração Estendida)"
                          : "09:00h às 16:00h (7 horas de navegação)"}
                      </p>
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 px-3.5 py-2.5 rounded-xl hover:border-amber-400 transition select-none">
                      <input
                        type="checkbox"
                        checked={includeSunset}
                        onChange={(e) => setIncludeSunset(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🌅</span>
                        <span className="text-xs font-bold text-amber-950">
                          Incluir Pôr do Sol
                        </span>
                      </div>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    O pôr do sol na Baía é um espetáculo à parte. Marcando a opção, a lancha ancora em enseada estratégica para o brinde ao entardecer.
                  </p>
                </div>

                {/* Quantidade de Passageiros (Sem vazamento de botões) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Adultos */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">Adultos</p>
                      <p className="text-[11px] text-slate-500">12 anos ou mais</p>
                    </div>
                    <div className="inline-flex items-center bg-white border border-slate-200/90 rounded-xl p-1 shadow-2xs shrink-0">
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
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
                        onClick={() => setAdults((prev) => Math.min(16, prev + 1))}
                        className="w-8 h-8 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center font-bold text-base transition cursor-pointer active:scale-95 shadow-2xs"
                        aria-label="Aumentar adultos"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Crianças */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">Crianças</p>
                      <p className="text-[11px] text-slate-500">Até 11 anos</p>
                    </div>
                    <div className="inline-flex items-center bg-white border border-slate-200/90 rounded-xl p-1 shadow-2xs shrink-0">
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
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
                        onClick={() => setChildren((prev) => Math.min(10, prev + 1))}
                        className="w-8 h-8 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center font-bold text-base transition cursor-pointer active:scale-95 shadow-2xs"
                        aria-label="Aumentar crianças"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* ETAPA 2: Seleção e Detalhamento do Roteiro */}
              <section className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-soft space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="w-8 h-8 rounded-full bg-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    2
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-brand-deep">
                      Roteiro Escolhido & Detalhamento
                    </h2>
                    <p className="text-xs text-slate-500">
                      Roteiros sincronizados com a tábua de marés local de Madre de Deus.
                    </p>
                  </div>
                </div>

                {/* Banner Informativo da Maré da Data */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-50 border border-cyan-200/80 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl shrink-0">🌊</span>
                    <p className="leading-snug">
                      Maré prevista para <strong>{formattedDateShort}</strong> ao meio-dia:{" "}
                      <strong className="text-brand-deep">{dayTideEval.middayPhase.name}</strong>. Os roteiros com condições favoráveis estão habilitados e destacados.
                    </p>
                  </div>
                  <span className="shrink-0 self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-900 border border-cyan-300">
                    Madre de Deus • BTS
                  </span>
                </div>

                {/* Seletores de Roteiro (Design Arejado, Amplo e Sem Amontoados) */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
                      <button
                        key={route.id}
                        type="button"
                        onClick={() => handleRouteClick(route)}
                        className={[
                          "p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-3.5",
                          isSelected && isFavorable
                            ? "bg-cyan-50/80 border-cyan-500 ring-2 ring-cyan-400/30 shadow-md"
                            : isSelected && !isFavorable
                            ? "bg-slate-800/10 border-amber-400 ring-2 ring-amber-400/30 shadow-md"
                            : !isFavorable
                            ? "bg-slate-100/90 border-slate-300 text-slate-600 hover:bg-slate-200/80"
                            : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70 shadow-xs"
                        ].join(" ")}
                      >
                        {/* Camada escura que cobre toda a área do retângulo quando desfavorável */}
                        {!isFavorable && (
                          <div
                            className="absolute inset-0 bg-slate-950/20 backdrop-saturate-50 pointer-events-none rounded-2xl z-10"
                            aria-hidden="true"
                          />
                        )}

                        <div className="relative z-10 space-y-3 w-full">
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
                                title={`Maré não favorável (${tideStatus.currentTide.name}). Melhor com: ${route.bestTidesLabel}`}
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
                              <h3
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
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1 line-clamp-2">
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

                          {/* 3. Paradas em lista organizada sem amontoados */}
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

                          {/* 4. Rodapé do Card */}
                          <div className="pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="text-slate-500 text-[11px]">
                              Melhor maré: <strong className="text-slate-700">{route.bestTidesLabel}</strong>
                            </span>
                            <span className={isSelected ? "text-cyan-600 font-bold" : "text-slate-400 font-semibold"}>
                              {isSelected ? "● Selecionado" : "○ Escolher"}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Box de Detalhamento do Roteiro Ativo */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 space-y-5">
                  <div className="relative aspect-[21/9] sm:aspect-[24/9] rounded-xl overflow-hidden shadow-xs">
                    <Image
                      src={currentRoute.image}
                      alt={currentRoute.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 700px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 text-white flex items-end justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300">
                          Roteiro Ativo
                        </span>
                        <h4 className="text-base sm:text-lg font-bold leading-tight">
                          {currentRoute.name}
                        </h4>
                      </div>
                      <span
                        className={[
                          "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shrink-0",
                          currentRouteTideStatus.isFavorable
                            ? "bg-emerald-500/80 text-white"
                            : "bg-amber-500/80 text-white"
                        ].join(" ")}
                      >
                        {currentRouteTideStatus.isFavorable ? "✓ Maré Favorável" : "⚠️ Maré Desfavorável"}
                      </span>
                    </div>
                  </div>

                  {/* Callout de Condição da Maré para o Roteiro Ativo */}
                  <div
                    className={[
                      "p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs",
                      currentRouteTideStatus.isFavorable
                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                        : "bg-amber-50/80 border-amber-200 text-amber-950"
                    ].join(" ")}
                  >
                    <div>
                      <p className="font-bold flex items-center gap-1.5">
                        <span>{currentRouteTideStatus.isFavorable ? "✓" : "⚠️"}</span>
                        <span>Condição de Maré para este Roteiro na Data:</span>
                        <strong className="underline decoration-current">
                          {currentRouteTideStatus.currentTide.name}
                        </strong>
                      </p>
                      <p className="text-[11px] opacity-85 mt-0.5">
                        {currentRouteTideStatus.explanation}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block">
                        Melhores Condições:
                      </span>
                      <span className="text-[11px] font-extrabold">
                        {currentRoute.bestTidesLabel}
                      </span>
                    </div>
                  </div>

                  {/* Observação náutica específica adicional no detalhamento do roteiro ativo */}
                  {currentRouteTideStatus.specificNotice && (
                    <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200/80 text-cyan-950 text-xs font-medium leading-relaxed">
                      {currentRouteTideStatus.specificNotice}
                    </div>
                  )}

                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">
                      Sobre a Experiência:
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {currentRoute.detailedDescription}
                    </p>
                  </div>

                  {/* Paradas Programadas Estruturadas */}
                  {currentRoute.stops && currentRoute.stops.length > 0 && (
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5">
                        Paradas Principais:
                      </h5>
                      <div className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                        {currentRoute.stops.map((stop, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-white border border-slate-200/70">
                            <span className="text-cyan-600 font-bold shrink-0 mt-0.5">•</span>
                            <span>{stop}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Itinerário de Paradas */}
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5">
                      Itinerário e Ordem de Navegação:
                    </h5>
                    <ul className="space-y-2">
                      {currentRoute.itinerary.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Destaques */}
                  <div className="pt-3 border-t border-slate-200">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                      Destaques deste Roteiro:
                    </h5>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      {currentRoute.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="text-cyan-500 font-bold">✓</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Seção Weather: Informações Meteorológicas, Vento e Tábua de Marés */}
              <PlanTourWeather
                selectedDate={selectedDate}
                includeSunset={includeSunset}
                className="shadow-soft"
              />

              {/* ETAPA 3: Preferência de Almoço */}
              <section className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-soft space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="w-8 h-8 rounded-full bg-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    3
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-brand-deep">
                      Preferência de Almoço / Alimentação
                    </h2>
                    <p className="text-xs text-slate-500">
                      Como você prefere saborear as delícias do litoral durante o passeio?
                    </p>
                  </div>
                </div>

                <div className="grid gap-3.5">
                  {LUNCH_PREFERENCES.map((option) => {
                    const isSelected = option.id === lunchPreference;
                    return (
                      <label
                        key={option.id}
                        className={[
                          "p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4",
                          isSelected
                            ? "bg-amber-50/60 border-amber-500 ring-2 ring-amber-400/20 shadow-xs"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="lunchPreference"
                          value={option.id}
                          checked={isSelected}
                          onChange={() => setLunchPreference(option.id)}
                          className="mt-1 w-4 h-4 text-amber-500 focus:ring-amber-400 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{option.icon}</span>
                              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                                {option.title}
                              </h3>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                              {option.tag}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-amber-900/80 mt-0.5">
                            {option.subtitle}
                          </p>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {option.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* ETAPA 4: Formulário de Dados Obrigatórios do Cliente */}
              <section className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-soft space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="w-8 h-8 rounded-full bg-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    4
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-brand-deep">
                      Dados do Titular da Reserva (Contrato / Charter)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Informações obrigatórias para formalização do afretamento náutico.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Nome Completo */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label
                      htmlFor={`${formId}-nome`}
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                      Nome Completo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id={`${formId}-nome`}
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo de Oliveira"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20 text-sm text-slate-900 bg-slate-50/50"
                    />
                  </div>

                  {/* CPF com Tooltip Informativo da Capitania dos Portos */}
                  <div className="space-y-1.5 relative">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={`${formId}-cpf`}
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                      >
                        CPF <span className="text-rose-500">*</span>
                      </label>

                      {/* Botão de Dúvida / Ajuda com Tooltip Popover */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCpfTooltip(!showCpfTooltip)}
                          onMouseEnter={() => setShowCpfTooltip(true)}
                          onMouseLeave={() => setShowCpfTooltip(false)}
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 hover:bg-cyan-100 text-slate-700 hover:text-cyan-800 text-xs font-bold transition cursor-pointer"
                          aria-label="Por que precisamos do seu CPF?"
                          title="Clique para saber por que precisamos do CPF"
                        >
                          ?
                        </button>

                        {showCpfTooltip && (
                          <div className="absolute right-0 bottom-full mb-2 w-72 p-3.5 rounded-2xl bg-slate-900 text-white text-xs shadow-2xl z-30 border border-white/20 animate-fadeIn pointer-events-none">
                            <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-1">
                              <span>⚓</span>
                              <span>Exigência Legal Marítima</span>
                            </div>
                            <p className="leading-relaxed text-slate-200 text-[11px]">
                              O CPF do contratante é obrigatório por exigência da <strong>Capitania dos Portos da Bahia</strong> para emissão do Termo de Afretamento (Charter Náutico) e da lista oficial de passageiros da embarcação.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <input
                      id={`${formId}-cpf`}
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => handleCpfChange(e.target.value)}
                      maxLength={14}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20 text-sm text-slate-900 bg-slate-50/50"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`${formId}-tel`}
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                      WhatsApp / Telefone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id={`${formId}-tel`}
                      type="tel"
                      required
                      placeholder="(71) 99999-9999"
                      value={telefone}
                      onChange={(e) => handleTelefoneChange(e.target.value)}
                      maxLength={15}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20 text-sm text-slate-900 bg-slate-50/50"
                    />
                  </div>

                  {/* E-mail */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label
                      htmlFor={`${formId}-email`}
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                      E-mail para Confirmação <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20 text-sm text-slate-900 bg-slate-50/50"
                    />
                  </div>

                  {/* Observações Opcionais */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label
                      htmlFor={`${formId}-obs`}
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                      Observações Especiais (Opcional)
                    </label>
                    <textarea
                      id={`${formId}-obs`}
                      rows={3}
                      placeholder="Ex: Aniversário de casamento, necessidade de gelo extra, restrições alimentares ou preferências de música."
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/20 text-sm text-slate-900 bg-slate-50/50 resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* ETAPA 5: Forma de Pagamento */}
              <section className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-soft space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="w-8 h-8 rounded-full bg-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    5
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-brand-deep">
                      Forma de Pagamento
                    </h2>
                    <p className="text-xs text-slate-500">
                      Como funciona o pagamento do afretamento náutico.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3.5">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = method.id === paymentMethod;
                    return (
                      <label
                        key={method.id}
                        className={[
                          "p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4",
                          isSelected
                            ? "bg-cyan-50/60 border-cyan-500 ring-2 ring-cyan-400/20 shadow-xs"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={isSelected}
                          onChange={() => setPaymentMethod(method.id)}
                          className="mt-1 w-4 h-4 text-cyan-600 focus:ring-cyan-400 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{method.icon}</span>
                              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                                {method.title}
                              </h3>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-100 text-cyan-900">
                              {method.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {method.description}
                          </p>

                          <div className="mt-2.5 space-y-1">
                            {method.details.map((item, idx) => (
                              <p key={idx} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                                <span className="text-cyan-500 font-bold">•</span>
                                <span>{item}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Termo de Garantia Climática */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-brand-deep">
                    <span>🛡️</span>
                    <span>Garantia Climática & Reagendamento:</span>
                  </div>
                  <p className="leading-relaxed">
                    Sua segurança é nossa prioridade. Em caso de condições climáticas adversas determinadas pela Capitania dos Portos que impeçam a navegação segura, o passeio é reagendado sem qualquer custo ou penalidade.
                  </p>
                </div>
              </section>

              {/* Mensagem de Erro de Validação */}
              {validationError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
                  <span>⚠️</span>
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            {/* Coluna da Direita: Card Resumo Sticky */}
            <div className="lg:sticky lg:top-28 h-fit space-y-6">
              <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-lg space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Resumo do Agendamento
                  </span>
                  <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                    Ao Vivo
                  </span>
                </div>

                {/* Roteiro */}
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400">
                    Roteiro Selecionado:
                  </span>
                  <h3 className="font-extrabold text-base text-brand-deep mt-0.5">
                    {currentRoute.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentRoute.tagline}
                  </p>
                </div>

                {/* Data e Horário */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Data:</span>
                    <strong className="text-slate-900 capitalize">{formattedDateShort}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Horário:</span>
                    <strong className="text-slate-900">
                      {includeSunset ? "09:00h às 17:30h" : "09:00h às 16:00h"}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Pôr do Sol:</span>
                    <strong className={includeSunset ? "text-amber-600 font-bold" : "text-slate-600"}>
                      {includeSunset ? "Incluso (+1h30)" : "Não incluso"}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Passageiros:</span>
                    <strong className="text-slate-900">
                      {adults} adulto(s){children > 0 ? `, ${children} criança(s)` : ""}
                    </strong>
                  </div>
                </div>

                {/* Almoço Selecionado */}
                <div className="text-xs">
                  <span className="text-[11px] font-semibold uppercase text-slate-400">
                    Almoço / Gastronomia:
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <span>{selectedLunchObj?.icon}</span>
                    <span>{selectedLunchObj?.title}</span>
                  </p>
                </div>

                {/* O Que Está Incluso */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Inclusos na Embarcação:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                    {INCLUDED_AMENITIES.map((item, i) => (
                      <div key={i} className="flex items-center gap-1 truncate">
                        <span>{item.icon}</span>
                        <span className="truncate">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botão de Envio do Agendamento */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-extrabold px-6 py-4 text-base transition shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Gerando Reserva...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmar e Agendar Passeio</span>
                      <span>↗</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center leading-snug">
                  Ao confirmar, você receberá o voucher prévio da lancha e o atendimento oficial da agência.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Alert / Modal de Confirmação no Centro da Tela para Maré Não Favorável */}
      <TideWarningDialog
        isOpen={Boolean(warningRoute)}
        route={warningRoute}
        selectedDate={selectedDate}
        onConfirm={handleConfirmWarning}
        onCancel={handleCancelWarning}
      />
    </div>
  );
}
