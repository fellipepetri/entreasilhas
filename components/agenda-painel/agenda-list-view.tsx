"use client";

import { useState, useMemo } from "react";
import type { BookingItem, PaymentStatus, BookingStatus } from "@/lib/booking-types";

interface AgendaListViewProps {
  bookings: BookingItem[];
  onSelectBooking: (booking: BookingItem) => void;
  onUpdateBooking: (id: string, partial: Partial<BookingItem>) => Promise<void>;
  initialFilter?: string;
}

export function AgendaListView({
  bookings,
  onSelectBooking,
  onUpdateBooking,
  initialFilter = "todos"
}: AgendaListViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);

  const todayStr = new Date().toISOString().split("T")[0];

  const formatCurrency = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((bk) => {
      // Filtro de Busca por texto
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesClient =
          bk.client.name.toLowerCase().includes(q) ||
          bk.client.email.toLowerCase().includes(q) ||
          bk.client.phone.includes(q) ||
          (bk.client.cpf && bk.client.cpf.includes(q));
        const matchesCode = bk.code.toLowerCase().includes(q);
        const matchesTour = bk.tourTitle.toLowerCase().includes(q);
        const matchesBoat = bk.boatName.toLowerCase().includes(q);

        if (!matchesClient && !matchesCode && !matchesTour && !matchesBoat) {
          return false;
        }
      }

      // Filtro por Categoria / Status
      if (selectedFilter === "proximos") {
        return bk.bookingStatus === "confirmado" && bk.date >= todayStr;
      }
      if (selectedFilter === "pago_total") {
        return bk.financial.paymentStatus === "pago_total" && bk.bookingStatus !== "cancelado";
      }
      if (selectedFilter === "pago_parcial") {
        return bk.financial.paymentStatus === "pago_parcial" && bk.bookingStatus !== "cancelado";
      }
      if (selectedFilter === "pendente") {
        return bk.financial.paymentStatus === "pendente" && bk.bookingStatus !== "cancelado";
      }
      if (selectedFilter === "realizado") {
        return bk.bookingStatus === "realizado" || (bk.bookingStatus === "confirmado" && bk.date < todayStr);
      }
      if (selectedFilter === "cancelado") {
        return bk.bookingStatus === "cancelado";
      }

      return true;
    });
  }, [bookings, searchTerm, selectedFilter, todayStr]);

  // Ordena por data decrescente (mais recente primeiro)
  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredBookings]);

  const filterTabs = [
    { id: "todos", label: "Todos", count: bookings.length },
    {
      id: "proximos",
      label: "Próximos",
      count: bookings.filter((b) => b.bookingStatus === "confirmado" && b.date >= todayStr).length
    },
    {
      id: "pago_total",
      label: "100% Pago (Total)",
      count: bookings.filter((b) => b.financial.paymentStatus === "pago_total" && b.bookingStatus !== "cancelado").length
    },
    {
      id: "pago_parcial",
      label: "50% Pago (Sinal)",
      count: bookings.filter((b) => b.financial.paymentStatus === "pago_parcial" && b.bookingStatus !== "cancelado").length
    },
    {
      id: "pendente",
      label: "Falta Pagar",
      count: bookings.filter((b) => b.financial.paymentStatus === "pendente" && b.bookingStatus !== "cancelado").length
    },
    {
      id: "realizado",
      label: "Realizados",
      count: bookings.filter((b) => b.bookingStatus === "realizado" || (b.bookingStatus === "confirmado" && b.date < todayStr)).length
    },
    {
      id: "cancelado",
      label: "Cancelados",
      count: bookings.filter((b) => b.bookingStatus === "cancelado").length
    }
  ];

  const getStatusBadge = (bk: BookingItem) => {
    const isPast = bk.date < todayStr;
    const isRealized = bk.bookingStatus === "realizado" || (bk.bookingStatus === "confirmado" && isPast);

    if (bk.bookingStatus === "cancelado") {
      return {
        label: "Cancelado",
        color: "bg-rose-500/20 text-rose-300 border-rose-500/30"
      };
    }

    if (isRealized) {
      return {
        label: "✓ Realizado",
        color: "bg-blue-500/20 text-blue-300 border-blue-500/30"
      };
    }

    switch (bk.financial.paymentStatus) {
      case "pago_total":
        return {
          label: "✅ 100% Pago",
          color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        };
      case "pago_parcial":
        return {
          label: "🪙 50% Pago (Sinal)",
          color: "bg-amber-500/20 text-amber-300 border-amber-500/30"
        };
      case "pendente":
        return {
          label: "⏳ Falta Pagar",
          color: "bg-rose-500/20 text-rose-300 border-rose-500/30"
        };
      default:
        return {
          label: "Pendente",
          color: "bg-slate-500/20 text-slate-300 border-slate-500/30"
        };
    }
  };

  return (
    <div className="space-y-5">
      {/* Barra de Filtros e Busca */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Campo de Busca */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, telefone, CPF, código ou embarcação..."
            className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-cyan-400 focus:bg-white/10 focus:outline-none"
          />
          <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Abas de Filtros Rápidos */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={[
                  "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition whitespace-nowrap cursor-pointer border",
                  isActive
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md"
                    : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
                ].join(" ")}
              >
                <span>{tab.label}</span>
                <span
                  className={[
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    isActive ? "bg-slate-950/20 text-slate-950" : "bg-white/10 text-slate-400"
                  ].join(" ")}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Reservas / Cartões Informativos */}
      {sortedBookings.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center text-slate-400">
          <span className="text-4xl block mb-2">🏖️</span>
          <p className="text-base font-semibold text-white">Nenhuma reserva encontrada</p>
          <p className="text-xs text-slate-400 mt-1">
            Tente ajustar os filtros de busca ou adicione uma nova reserva.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedBookings.map((bk) => {
            const badge = getStatusBadge(bk);
            const total = bk.financial.totalAmount;
            const paid = bk.financial.paidAmount;
            const percentPaid = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
            const isPast = bk.date < todayStr;

            return (
              <div
                key={bk.id}
                className="group relative rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-md shadow-md transition-all duration-300 hover:border-cyan-400/40 hover:bg-slate-900/90 hover:shadow-xl"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Bloco 1: Data, Código e Cliente (Totalmente Clicável) */}
                  <button
                    type="button"
                    onClick={() => onSelectBooking(bk)}
                    className="flex-1 text-left flex flex-col sm:flex-row sm:items-center gap-3.5 cursor-pointer"
                    title="Clique para abrir todos os detalhes deste cliente"
                  >
                    {/* Badge da Data */}
                    <div className="flex sm:flex-col items-center justify-center shrink-0 w-full sm:w-20 rounded-xl bg-cyan-950/50 border border-cyan-500/30 p-2 sm:p-2.5 text-center">
                      <span className="text-xs text-cyan-300 font-semibold sm:block">
                        {formatDateDisplay(bk.date).split("/")[0]}/{formatDateDisplay(bk.date).split("/")[1]}
                      </span>
                      <span className="text-xs text-slate-400 font-medium sm:block ml-2 sm:ml-0">
                        {formatDateDisplay(bk.date).split("/")[2]}
                      </span>
                    </div>

                    {/* Informações do Cliente & Passeio */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-white group-hover:text-cyan-300 transition truncate">
                          {bk.client.name}
                        </span>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-cyan-200">
                          {bk.code}
                        </span>
                        <span
                          className={[
                            "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                            badge.color
                          ].join(" ")}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 truncate">
                        <strong className="text-brand-sand">{bk.tourTitle}</strong> • {bk.boatName}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                        <span>👥 {bk.guests.adults} ad. {bk.guests.children > 0 ? `+ ${bk.guests.children} cr.` : ""}</span>
                        <span>•</span>
                        <span>⏰ {bk.time}</span>
                        <span>•</span>
                        <span>📍 {bk.boardingLocation.split("—")[0].trim()}</span>
                      </div>
                    </div>
                  </button>

                  {/* Bloco 2: Financeiro Detalhado & Barra de Progresso */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 border-t lg:border-t-0 border-white/10 pt-3 lg:pt-0">
                    <div className="text-left sm:text-right min-w-[130px]">
                      <div className="text-xs text-slate-400">
                        Total: <strong className="text-white">{formatCurrency(bk.financial.totalAmount)}</strong>
                      </div>

                      <div className="text-xs font-bold mt-0.5">
                        {bk.financial.remainingAmount === 0 ? (
                          <span className="text-emerald-400">100% Quitado</span>
                        ) : (
                          <span className="text-rose-400">
                            Falta: {formatCurrency(bk.financial.remainingAmount)}
                          </span>
                        )}
                      </div>

                      {/* Mini Barra de Progresso do Pagamento */}
                      <div className="mt-1.5 h-1.5 w-full sm:w-28 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={[
                            "h-full rounded-full transition-all duration-500",
                            percentPaid === 100
                              ? "bg-emerald-400"
                              : percentPaid >= 50
                              ? "bg-amber-400"
                              : "bg-rose-500"
                          ].join(" ")}
                          style={{ width: `${percentPaid}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {percentPaid}% pago ({bk.financial.paymentMethod})
                      </span>
                    </div>

                    {/* Bloco 3: Botões de Ação */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => onSelectBooking(bk)}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold text-white transition cursor-pointer shadow-sm"
                        title="Ver ficha completa do cliente"
                      >
                        Ver Detalhes ↗
                      </button>

                      {/* WhatsApp Direto */}
                      <a
                        href={`https://wa.me/55${bk.client.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Olá ${bk.client.name}! Equipe Entre as Ilhas falando sobre sua reserva ${bk.code}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition cursor-pointer shadow-sm"
                        title="Conversar com o cliente no WhatsApp"
                      >
                        💬
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
