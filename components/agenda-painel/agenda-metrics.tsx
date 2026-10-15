"use client";

import type { BookingItem } from "@/lib/booking-types";

interface AgendaMetricsProps {
  bookings: BookingItem[];
  onSelectFilter?: (filter: string) => void;
  activeFilter?: string;
}

export function AgendaMetrics({
  bookings,
  onSelectFilter,
  activeFilter
}: AgendaMetricsProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  const upcomingBookings = bookings.filter(
    (b) => b.bookingStatus === "confirmado" && b.date >= todayStr
  );

  const fullyPaidBookings = bookings.filter(
    (b) => b.bookingStatus !== "cancelado" && b.financial.paymentStatus === "pago_total"
  );

  const partialPaidBookings = bookings.filter(
    (b) => b.bookingStatus === "confirmado" && b.financial.paymentStatus === "pago_parcial"
  );

  const pendingBookings = bookings.filter(
    (b) => b.bookingStatus === "confirmado" && b.financial.paymentStatus === "pendente"
  );

  const realizedBookings = bookings.filter(
    (b) => b.bookingStatus === "realizado" || (b.bookingStatus === "confirmado" && b.date < todayStr)
  );

  const totalReceived = bookings
    .filter((b) => b.bookingStatus !== "cancelado")
    .reduce((acc, b) => acc + (b.financial.paidAmount || 0), 0);

  const totalPending = upcomingBookings.reduce(
    (acc, b) => acc + (b.financial.remainingAmount || 0),
    0
  );

  const formatCurrency = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const cards = [
    {
      id: "proximos",
      title: "Próximos Passeios",
      badge: `${upcomingBookings.length} agendados`,
      mainValue: upcomingBookings.length.toString(),
      subValue: `Próximo: ${upcomingBookings[0]?.date ? new Date(upcomingBookings[0].date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : "Nenhum"}`,
      icon: "📅",
      accentBorder: "hover:border-cyan-400/50",
      bgGrad: "from-cyan-950/40 to-slate-900/60",
      textColor: "text-cyan-300"
    },
    {
      id: "pago_total",
      title: "100% Pago (Valor Total)",
      badge: `${fullyPaidBookings.length} passeios`,
      mainValue: fullyPaidBookings.length.toString(),
      subValue: formatCurrency(
        fullyPaidBookings.reduce((acc, b) => acc + b.financial.paidAmount, 0)
      ),
      icon: "✅",
      accentBorder: "hover:border-emerald-400/50",
      bgGrad: "from-emerald-950/40 to-slate-900/60",
      textColor: "text-emerald-400"
    },
    {
      id: "pago_parcial",
      title: "50% Pago (Sinal Recebido)",
      badge: `${partialPaidBookings.length} reservas`,
      mainValue: partialPaidBookings.length.toString(),
      subValue: `Recebido: ${formatCurrency(
        partialPaidBookings.reduce((acc, b) => acc + b.financial.paidAmount, 0)
      )}`,
      icon: "🪙",
      accentBorder: "hover:border-amber-400/50",
      bgGrad: "from-amber-950/40 to-slate-900/60",
      textColor: "text-amber-400"
    },
    {
      id: "pendente",
      title: "Falta Pagar (A Receber)",
      badge: `${pendingBookings.length} pendentes`,
      mainValue: formatCurrency(totalPending),
      subValue: `${pendingBookings.length} reserva(s) sem sinal`,
      icon: "⏳",
      accentBorder: "hover:border-rose-400/50",
      bgGrad: "from-rose-950/40 to-slate-900/60",
      textColor: "text-rose-400"
    },
    {
      id: "realizado",
      title: "Histórico de Realizados",
      badge: `${realizedBookings.length} concluídos`,
      mainValue: realizedBookings.length.toString(),
      subValue: `Total faturado: ${formatCurrency(totalReceived)}`,
      icon: "⚓",
      accentBorder: "hover:border-blue-400/50",
      bgGrad: "from-blue-950/40 to-slate-900/60",
      textColor: "text-blue-300"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
      {cards.map((c) => {
        const isSelected = activeFilter === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectFilter?.(c.id)}
            className={[
              "relative text-left rounded-2xl border p-4 sm:p-5 transition-all duration-300 backdrop-blur-md cursor-pointer",
              "bg-gradient-to-br",
              c.bgGrad,
              isSelected
                ? "border-cyan-400 shadow-[0_0_20px_rgba(20,152,213,0.35)] scale-[1.02]"
                : `border-white/10 ${c.accentBorder} hover:-translate-y-0.5 hover:shadow-lg`
            ].join(" ")}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl sm:text-2xl">{c.icon}</span>
              <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                {c.badge}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-400 truncate">
              {c.title}
            </p>

            <p className={["text-xl sm:text-2xl font-extrabold tracking-tight mt-1", c.textColor].join(" ")}>
              {c.mainValue}
            </p>

            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {c.subValue}
            </p>
          </button>
        );
      })}
    </div>
  );
}
