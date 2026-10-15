"use client";

import { useState } from "react";
import type { BookingItem, BlockedDate } from "@/lib/booking-types";

interface AgendaCalendarViewProps {
  bookings: BookingItem[];
  blockedDates: BlockedDate[];
  onSelectBooking: (booking: BookingItem) => void;
  onOpenNewBookingWithDate?: (dateStr: string) => void;
  onToggleBlockDate: (dateStr: string, reason?: string) => Promise<void>;
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

const WEEKDAY_NAMES = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function AgendaCalendarView({
  bookings,
  blockedDates,
  onSelectBooking,
  onOpenNewBookingWithDate,
  onToggleBlockDate
}: AgendaCalendarViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Navegação
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Construção dos dias da grade (segunda a domingo)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // No JS, 0 é domingo, 1 é segunda. Ajusta para Segunda=0 ... Domingo=6
  let firstDayIndex = firstDayOfMonth.getDay() - 1;
  if (firstDayIndex === -1) firstDayIndex = 6;

  const totalDays = lastDayOfMonth.getDate();

  // Dias do mês anterior para preencher a primeira semana
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  const prevDays: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const m = currentMonth === 0 ? 12 : currentMonth;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    prevDays.push({ day, isCurrentMonth: false, dateStr });
  }

  // Dias do mês atual
  const currentDays: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    currentDays.push({ day, isCurrentMonth: true, dateStr });
  }

  // Dias do próximo mês para completar a última semana
  const totalSlots = prevDays.length + currentDays.length;
  const remainingSlots = (7 - (totalSlots % 7)) % 7;
  const nextDays: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];
  for (let day = 1; day <= remainingSlots; day++) {
    const m = currentMonth === 11 ? 1 : currentMonth + 2;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    nextDays.push({ day, isCurrentMonth: false, dateStr });
  }

  const allCalendarDays = [...prevDays, ...currentDays, ...nextDays];

  // Helpers de busca
  const getBookingsForDate = (dateStr: string) =>
    bookings.filter((b) => b.date === dateStr && b.bookingStatus !== "cancelado");

  const getBlockedForDate = (dateStr: string) =>
    blockedDates.find((b) => b.date === dateStr);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-7 backdrop-blur-xl shadow-xl">
      {/* Controles de Navegação do Calendário */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <span>📅</span>
            <span>
              {MONTH_NAMES[currentMonth]} de {currentYear}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Clique em qualquer agendamento para abrir a ficha completa do cliente e do passeio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGoToday}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            Hoje
          </button>
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
              aria-label="Mês anterior"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
              aria-label="Próximo mês"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Cabeçalho dos Dias da Semana */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-4 pb-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
        {WEEKDAY_NAMES.map((name, i) => (
          <div
            key={name}
            className={i >= 5 ? "text-cyan-400" : ""}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Grade Mensal do Calendário */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {allCalendarDays.map((slot, idx) => {
          const isToday = slot.dateStr === todayStr;
          const dayBookings = getBookingsForDate(slot.dateStr);
          const blocked = getBlockedForDate(slot.dateStr);
          const isPast = slot.dateStr < todayStr;
          const isAvailable = slot.isCurrentMonth && !blocked && dayBookings.length === 0 && !isPast;

          return (
            <div
              key={`${slot.dateStr}-${idx}`}
              className={[
                "group relative min-h-[115px] sm:min-h-[140px] rounded-2xl border p-2 sm:p-2.5 transition-all flex flex-col justify-between",
                !slot.isCurrentMonth
                  ? "border-white/5 bg-slate-950/20 opacity-35"
                  : blocked
                  ? "border-rose-500/30 bg-rose-950/15"
                  : dayBookings.length > 0
                  ? "border-white/15 bg-white/[0.04] shadow-sm"
                  : isToday
                  ? "border-cyan-400/50 bg-cyan-950/20 shadow-md"
                  : "border-white/8 bg-white/[0.02] hover:bg-white/[0.05]"
              ].join(" ")}
            >
              {/* Topo da Célula: Dia & Badges rápidos */}
              <div className="flex items-center justify-between">
                <span
                  className={[
                    "inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg text-xs font-bold",
                    isToday
                      ? "bg-cyan-500 text-slate-950 shadow-md"
                      : isPast
                      ? "text-slate-500"
                      : "text-white"
                  ].join(" ")}
                >
                  {slot.day}
                </span>

                {/* Status Rápido no topo */}
                {blocked ? (
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                    🚫 Bloqueado
                  </span>
                ) : dayBookings.length > 0 ? (
                  <span className="text-[10px] font-bold text-slate-400">
                    {dayBookings.length} {dayBookings.length === 1 ? "charter" : "charters"}
                  </span>
                ) : isAvailable ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="hidden sm:inline">Livre</span>
                  </span>
                ) : null}
              </div>

              {/* Corpo da Célula: Agendamentos, Bloqueio ou Ações */}
              <div className="my-1.5 space-y-1.5 flex-1">
                {/* Se há bloqueio manual */}
                {blocked ? (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-1.5 text-[11px] text-rose-200">
                    <p className="font-semibold truncate">{blocked.reason}</p>
                    <button
                      type="button"
                      onClick={() => onToggleBlockDate(slot.dateStr)}
                      className="mt-1 text-[10px] underline text-rose-300 hover:text-white cursor-pointer"
                    >
                      Desbloquear
                    </button>
                  </div>
                ) : null}

                {/* Se há reservas nesta data */}
                {dayBookings.map((bk) => {
                  const isRealized = bk.bookingStatus === "realizado" || (bk.bookingStatus === "confirmado" && isPast);
                  const isFull = bk.financial.paymentStatus === "pago_total";
                  const isPartial = bk.financial.paymentStatus === "pago_parcial";
                  const isPending = bk.financial.paymentStatus === "pendente";

                  return (
                    <button
                      key={bk.id}
                      type="button"
                      onClick={() => onSelectBooking(bk)}
                      title={`Clique para ver a ficha completa de ${bk.client.name}`}
                      className={[
                        "w-full text-left rounded-xl p-1.5 sm:p-2 border transition-all duration-200 cursor-pointer shadow-xs",
                        "hover:scale-[1.03] active:scale-95",
                        isRealized
                          ? "border-blue-500/30 bg-blue-950/40 text-blue-200 hover:border-blue-400"
                          : isFull
                          ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-200 hover:border-emerald-400"
                          : isPartial
                          ? "border-amber-500/30 bg-amber-950/40 text-amber-200 hover:border-amber-400"
                          : isPending
                          ? "border-rose-500/30 bg-rose-950/40 text-rose-200 hover:border-rose-400"
                          : "border-cyan-500/30 bg-cyan-950/40 text-cyan-200"
                      ].join(" ")}
                    >
                      {/* Nome do Cliente */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs truncate text-white">
                          👤 {bk.client.name.split(" ")[0]} {bk.client.name.split(" ")[1]?.[0] || ""}.
                        </span>
                        <span className="text-[10px] shrink-0 font-mono opacity-80">
                          {bk.guests.totalGuests}p
                        </span>
                      </div>

                      {/* Tag de Status de Pagamento / Realizado */}
                      <div className="mt-1 flex items-center justify-between text-[10px]">
                        {isRealized ? (
                          <span className="font-semibold text-blue-300">✓ Realizado</span>
                        ) : isFull ? (
                          <span className="font-bold text-emerald-300">✅ 100% Pago</span>
                        ) : isPartial ? (
                          <span className="font-bold text-amber-300">🪙 50% Pago</span>
                        ) : (
                          <span className="font-bold text-rose-300">⏳ Falta Pagar</span>
                        )}

                        <span className="text-[9px] text-slate-400 hidden sm:inline truncate max-w-[60px]">
                          {bk.tourTitle.split("&")[0].trim()}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {/* Se está disponível e o admin quiser ação rápida */}
                {isAvailable && !blocked ? (
                  <div className="hidden group-hover:flex items-center gap-1 pt-1 animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => onOpenNewBookingWithDate?.(slot.dateStr)}
                      className="flex-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-[10px] font-bold py-1 transition cursor-pointer"
                      title="Agendar reserva nesta data"
                    >
                      + Agendar
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleBlockDate(slot.dateStr)}
                      className="px-1.5 rounded-lg bg-white/10 hover:bg-rose-500 hover:text-white text-slate-400 text-[10px] font-semibold py-1 transition cursor-pointer"
                      title="Bloquear data para manutenção"
                    >
                      🔒
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Rodapé da Célula: Dia da semana curto em telas pequenas */}
              <div className="text-[10px] text-slate-500 truncate">
                {slot.isCurrentMonth && !blocked && dayBookings.length === 0 && isPast ? (
                  <span>Data passada</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda Explicativa de Cores */}
      <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-4 border-t border-white/10 pt-5 text-xs text-slate-300">
        <span className="font-semibold text-slate-400 text-xs">Legenda:</span>

        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm" />
          <span>100% Pago (Total)</span>
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-amber-500 shadow-sm" />
          <span>50% Pago (Sinal)</span>
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-500 shadow-sm" />
          <span>Falta Pagar (Pendente)</span>
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-blue-500 shadow-sm" />
          <span>Passeio Realizado</span>
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-slate-600 shadow-sm" />
          <span>Data Bloqueada</span>
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border border-emerald-400 bg-transparent shadow-sm" />
          <span>Data Disponível</span>
        </span>
      </div>
    </div>
  );
}
