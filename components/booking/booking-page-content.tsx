"use client";

import { useSearchParams } from "next/navigation";
import { useState, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BOOKING_ROUTES,
  LUNCH_PREFERENCES,
  PAYMENT_METHODS,
  INCLUDED_AMENITIES,
  type BookingRouteOption,
  type LunchPreferenceOption,
  type PaymentMethodOption
} from "@/data/booking";

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

  // Parse dos parâmetros vindos do modal ou link
  const paramDate = searchParams?.get("data");
  const paramAdults = Number(searchParams?.get("adultos")) || 2;
  const paramChildren = Number(searchParams?.get("criancas")) || 0;
  const paramSunset = searchParams?.get("porDoSol") === "true";
  const paramRoute = searchParams?.get("roteiro") || "ilha-dos-frades-guadalupe";

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
  const [selectedRouteId, setSelectedRouteId] = useState<string>(paramRoute);

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
    BOOKING_ROUTES.find((r) => r.id === selectedRouteId) || BOOKING_ROUTES[0];

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
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
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
          /* Formulário Principal em 2 Colunas */
          <form onSubmit={handleSubmitBooking} className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
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
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition cursor-pointer"
                    >
                      {isCalendarOpen ? "Ocultar Calendário" : "Alterar Data"}
                    </button>
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

                {/* Quantidade de Passageiros */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Adultos</p>
                      <p className="text-[10px] text-slate-500">12 anos ou mais</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                        disabled={adults <= 1}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 cursor-pointer shadow-xs"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm text-slate-900 w-5 text-center">
                        {adults}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.min(16, prev + 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer shadow-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Crianças</p>
                      <p className="text-[10px] text-slate-500">Até 11 anos</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                        disabled={children <= 0}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 cursor-pointer shadow-xs"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm text-slate-900 w-5 text-center">
                        {children}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.min(10, prev + 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer shadow-xs"
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
                      Selecione o roteiro de sua preferência para visualizar paradas e atrativos.
                    </p>
                  </div>
                </div>

                {/* Seletores de Roteiro */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {BOOKING_ROUTES.map((route) => {
                    const isSelected = route.id === selectedRouteId;
                    return (
                      <button
                        key={route.id}
                        type="button"
                        onClick={() => setSelectedRouteId(route.id)}
                        className={[
                          "p-4 rounded-2xl border text-left transition-all cursor-pointer relative",
                          isSelected
                            ? "bg-cyan-50/70 border-cyan-500 ring-2 ring-cyan-400/20 shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        ].join(" ")}
                      >
                        {route.badge && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-cyan-100 text-cyan-800">
                            {route.badge}
                          </span>
                        )}
                        <h3 className="font-bold text-sm text-slate-900 pr-12">
                          {route.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {route.shortDescription}
                        </p>
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
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300">
                        Roteiro Exclusivo
                      </span>
                      <h4 className="text-base sm:text-lg font-bold leading-tight">
                        {currentRoute.name}
                      </h4>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">
                      Sobre a Experiência:
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {currentRoute.detailedDescription}
                    </p>
                  </div>

                  {/* Itinerário de Paradas */}
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5">
                      Itinerário e Paradas Programadas:
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
    </div>
  );
}
