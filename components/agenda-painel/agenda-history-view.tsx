"use client";

import { useState, useMemo } from "react";
import type { BookingItem } from "@/lib/booking-types";

interface AgendaHistoryViewProps {
  bookings: BookingItem[];
  onSelectBooking: (booking: BookingItem) => void;
}

export function AgendaHistoryView({
  bookings,
  onSelectBooking
}: AgendaHistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const todayStr = new Date().toISOString().split("T")[0];

  const formatCurrency = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString("pt-BR", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric"
        });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  // Filtra apenas os que já aconteceram
  const realizedList = useMemo(() => {
    return bookings.filter(
      (b) => b.bookingStatus === "realizado" || (b.bookingStatus === "confirmado" && b.date < todayStr)
    );
  }, [bookings, todayStr]);

  // Aplica busca
  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return realizedList;
    const q = searchTerm.toLowerCase();
    return realizedList.filter(
      (b) =>
        b.client.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.tourTitle.toLowerCase().includes(q) ||
        b.boatName.toLowerCase().includes(q) ||
        b.notes.toLowerCase().includes(q)
    );
  }, [realizedList, searchTerm]);

  // Ordena pelo mais recente
  const sortedList = useMemo(() => {
    return [...filteredList].sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredList]);

  // Métricas históricas
  const totalRealizedRevenue = realizedList.reduce(
    (acc, b) => acc + (b.financial.paidAmount || 0),
    0
  );
  const totalPassengersEmbarcados = realizedList.reduce(
    (acc, b) => acc + (b.guests.totalGuests || 0),
    0
  );
  const avgPassengers =
    realizedList.length > 0 ? (totalPassengersEmbarcados / realizedList.length).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Topo com Estatísticas Históricas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 sm:p-5 backdrop-blur-md">
          <span className="text-2xl block mb-1">⚓</span>
          <span className="text-xs font-semibold text-slate-400 uppercase">Passeios Concluídos</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-300 mt-1">
            {realizedList.length}
          </p>
          <span className="text-[11px] text-slate-400 block mt-1">
            Total de charters realizados
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 sm:p-5 backdrop-blur-md">
          <span className="text-2xl block mb-1">💰</span>
          <span className="text-xs font-semibold text-slate-400 uppercase">Faturamento Realizado</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 truncate">
            {formatCurrency(totalRealizedRevenue)}
          </p>
          <span className="text-[11px] text-slate-400 block mt-1">
            100% recebido e liquidado
          </span>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 sm:p-5 backdrop-blur-md">
          <span className="text-2xl block mb-1">👥</span>
          <span className="text-xs font-semibold text-slate-400 uppercase">Passageiros Embarcados</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-cyan-300 mt-1">
            {totalPassengersEmbarcados}
          </p>
          <span className="text-[11px] text-slate-400 block mt-1">
            Navegantes na Baía
          </span>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 sm:p-5 backdrop-blur-md">
          <span className="text-2xl block mb-1">⭐</span>
          <span className="text-xs font-semibold text-slate-400 uppercase">Média p/ Passeio</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1">
            {avgPassengers} <span className="text-sm font-normal text-slate-400">pessoas</span>
          </p>
          <span className="text-[11px] text-slate-400 block mt-1">
            Ocupação excelente
          </span>
        </div>
      </div>

      {/* Caixa de Busca no Histórico */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📜</span>
            <span>Registro Histórico Cronológico</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Clique em qualquer registro para visualizar ou editar as anotações do cliente e da viagem.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar histórico..."
            className="w-full rounded-xl border border-white/15 bg-white/5 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
          />
          <span className="absolute left-3 top-2 text-slate-400 text-xs">🔍</span>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tabela / Cards do Histórico */}
      {sortedList.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center text-slate-400">
          <p className="text-base font-semibold text-white">Nenhum passeio histórico encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedList.map((bk) => (
            <div
              key={bk.id}
              className="group rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-md shadow-md transition-all hover:border-blue-400/50 hover:bg-slate-900/90 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Informações da Data e Cliente (Clicável) */}
                <button
                  type="button"
                  onClick={() => onSelectBooking(bk)}
                  className="flex-1 text-left flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
                  title="Clique para ver a ficha completa de histórico deste cliente"
                >
                  <div className="shrink-0 flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xl font-bold">
                    ✓
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-white text-base group-hover:text-cyan-300 transition truncate">
                        {bk.client.name}
                      </span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-cyan-200">
                        {bk.code}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Realizado em {formatDateDisplay(bk.date)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1">
                      <strong className="text-brand-sand">{bk.tourTitle}</strong> • {bk.boatName}
                    </p>

                    {bk.notes ? (
                      <p className="text-xs text-slate-400 italic mt-1.5 truncate max-w-xl">
                        &ldquo;{bk.notes}&rdquo;
                      </p>
                    ) : null}
                  </div>
                </button>

                {/* Resumo Financeiro e Ação */}
                <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Total Quitado</span>
                    <span className="text-base sm:text-lg font-extrabold text-emerald-400">
                      {formatCurrency(bk.financial.totalAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {bk.financial.paymentMethod} • {bk.guests.totalGuests} passageiros
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectBooking(bk)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold text-white transition cursor-pointer shadow-sm shrink-0"
                  >
                    Ver Ficha ↗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
