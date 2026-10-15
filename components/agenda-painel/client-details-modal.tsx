"use client";

import { useEffect, useState } from "react";
import type { BookingItem, PaymentStatus, BookingStatus } from "@/lib/booking-types";

interface ClientDetailsModalProps {
  booking: BookingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateBooking: (id: string, partial: Partial<BookingItem>) => Promise<void>;
}

export function ClientDetailsModal({
  booking,
  isOpen,
  onClose,
  onUpdateBooking
}: ClientDetailsModalProps) {
  const [internalNotes, setInternalNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesFeedback, setNotesFeedback] = useState("");

  // Sincroniza anotações ao abrir
  useEffect(() => {
    if (booking) {
      setInternalNotes(booking.notes || "");
      setNotesFeedback("");
    }
  }, [booking]);

  // Fechar no Esc
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Trava scroll da tela
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const formatCurrency = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric"
        });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "pago_total":
        return {
          label: "100% Pago (Total)",
          bg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
          icon: "✓"
        };
      case "pago_parcial":
        return {
          label: "50% Pago (Sinal Recebido)",
          bg: "bg-amber-500/20 text-amber-300 border-amber-400/40",
          icon: "½"
        };
      case "pendente":
        return {
          label: "Falta Pagar (Pendente)",
          bg: "bg-rose-500/20 text-rose-300 border-rose-400/40",
          icon: "⏳"
        };
      case "reembolsado":
        return {
          label: "Reembolsado",
          bg: "bg-slate-500/20 text-slate-300 border-slate-400/40",
          icon: "↺"
        };
    }
  };

  const getBookingStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "confirmado":
        return {
          label: "Agendamento Confirmado",
          bg: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
        };
      case "realizado":
        return {
          label: "Passeio Realizado",
          bg: "bg-blue-500/20 text-blue-300 border-blue-400/40"
        };
      case "cancelado":
        return {
          label: "Reserva Cancelada",
          bg: "bg-rose-500/20 text-rose-300 border-rose-400/40"
        };
    }
  };

  const paymentBadge = getPaymentStatusBadge(booking.financial.paymentStatus);
  const statusBadge = getBookingStatusBadge(booking.bookingStatus);

  // Link para o WhatsApp com mensagem amigável
  const cleanPhone = booking.client.phone.replace(/\D/g, "");
  const whatsappText = `Olá ${booking.client.name}! Aqui é da equipe Entre as Ilhas. Entro em contato referente à sua reserva *${booking.code}* do passeio *${booking.tourTitle}* agendado para o dia *${booking.date}*.`;
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(whatsappText)}`;

  // Ações de alteração de status
  const handleSetPayment = async (status: PaymentStatus) => {
    let paidAmount = booking.financial.paidAmount;
    const total = booking.financial.totalAmount;

    if (status === "pago_total") {
      paidAmount = total;
    } else if (status === "pago_parcial") {
      paidAmount = Math.round(total / 2);
    } else if (status === "pendente") {
      paidAmount = 0;
    }

    await onUpdateBooking(booking.id, {
      financial: {
        ...booking.financial,
        paidAmount,
        remainingAmount: Math.max(0, total - paidAmount),
        paymentStatus: status,
        paidAt: status === "pago_total" ? new Date().toISOString() : booking.financial.paidAt
      }
    });
  };

  const handleSetBookingStatus = async (status: BookingStatus) => {
    await onUpdateBooking(booking.id, {
      bookingStatus: status
    });
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    setNotesFeedback("");
    try {
      await onUpdateBooking(booking.id, {
        notes: internalNotes.trim()
      });
      setNotesFeedback("Anotações salvas com sucesso!");
      setTimeout(() => setNotesFeedback(""), 3000);
    } catch {
      setNotesFeedback("Erro ao salvar anotações.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card do Modal */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/20 bg-gradient-to-b from-slate-900 via-slate-900 to-[#071d3a] p-5 sm:p-8 text-white shadow-[0_25px_80px_rgba(3,14,33,0.95)] animate-scaleUp">
        {/* Topo do Modal */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xl font-bold shadow-inner">
              {booking.client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {booking.client.name}
                </h3>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-white/10 text-cyan-300 font-semibold border border-white/10">
                  {booking.code}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Reserva registrada em {new Date(booking.createdAt).toLocaleDateString("pt-BR")} às {new Date(booking.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white cursor-pointer"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Badges de Status */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <span className={["inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border", paymentBadge.bg].join(" ")}>
            <span>{paymentBadge.icon}</span>
            <span>{paymentBadge.label}</span>
          </span>

          <span className={["inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border", statusBadge.bg].join(" ")}>
            <span>⚓</span>
            <span>{statusBadge.label}</span>
          </span>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-sm ml-auto cursor-pointer"
          >
            <span>Conversar no WhatsApp</span>
            <span>💬</span>
          </a>
        </div>

        {/* Grid de Informações Detalhadas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card: Dados do Cliente */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                👤 Dados do Titular (Charter)
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Nome:</span>
                <span className="font-semibold text-white">{booking.client.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CPF:</span>
                <span className="font-semibold text-white font-mono">{booking.client.cpf || "Não informado"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Telefone / WhatsApp:</span>
                <span className="font-semibold text-emerald-400">{booking.client.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">E-mail:</span>
                <span className="font-semibold text-white">{booking.client.email}</span>
              </div>
            </div>
          </div>

          {/* Card: Logística & Passeio */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                🛥️ Detalhes do Passeio
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Roteiro:</span>
                <span className="font-bold text-brand-sand text-right">{booking.tourTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Data Agendada:</span>
                <span className="font-semibold text-white text-right capitalize">
                  {formatDateDisplay(booking.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Horário:</span>
                <span className="font-semibold text-white">{booking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Embarcação:</span>
                <span className="font-semibold text-cyan-300">{booking.boatName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Local de Embarque:</span>
                <span className="font-semibold text-white text-right">{booking.boardingLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Passageiros:</span>
                <span className="font-bold text-white">
                  {booking.guests.adults} adulto(s) {booking.guests.children > 0 ? `+ ${booking.guests.children} criança(s)` : ""} (Total: {booking.guests.totalGuests})
                </span>
              </div>
            </div>
          </div>

          {/* Card: Financeiro Detalhado */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 sm:p-5 space-y-3 md:col-span-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                💰 Extrato Financeiro & Pagamento
              </span>
              <span className="text-xs text-slate-400">
                Método: <strong className="text-white">{booking.financial.paymentMethod}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-xl bg-white/5 p-3 text-center border border-white/10">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Valor Total</span>
                <p className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                  {formatCurrency(booking.financial.totalAmount)}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-500/10 p-3 text-center border border-emerald-500/30">
                <span className="text-[11px] text-emerald-300 uppercase font-semibold">Valor Pago</span>
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-0.5">
                  {formatCurrency(booking.financial.paidAmount)}
                </p>
                {booking.financial.paidAt ? (
                  <span className="text-[10px] text-emerald-300 block">
                    Recebido em {new Date(booking.financial.paidAt).toLocaleDateString("pt-BR")}
                  </span>
                ) : null}
              </div>

              <div className="rounded-xl bg-rose-500/10 p-3 text-center border border-rose-500/30">
                <span className="text-[11px] text-rose-300 uppercase font-semibold">Falta Pagar</span>
                <p className="text-xl sm:text-2xl font-extrabold text-rose-400 mt-0.5">
                  {formatCurrency(booking.financial.remainingAmount)}
                </p>
                <span className="text-[10px] text-slate-400 block">
                  {booking.financial.remainingAmount === 0 ? "100% Quitado" : "Cobrar no embarque"}
                </span>
              </div>
            </div>

            {/* Ações Rápidas de Alteração de Pagamento */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-300 font-semibold mr-1">Alterar Pagamento:</span>
              <button
                type="button"
                onClick={() => handleSetPayment("pago_total")}
                disabled={booking.financial.paymentStatus === "pago_total"}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-white transition disabled:opacity-40 cursor-pointer"
              >
                ✓ Marcar 100% Pago
              </button>
              <button
                type="button"
                onClick={() => handleSetPayment("pago_parcial")}
                disabled={booking.financial.paymentStatus === "pago_parcial"}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-white transition disabled:opacity-40 cursor-pointer"
              >
                ½ Marcar 50% Pago (Sinal)
              </button>
              <button
                type="button"
                onClick={() => handleSetPayment("pendente")}
                disabled={booking.financial.paymentStatus === "pendente"}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition disabled:opacity-40 cursor-pointer"
              >
                ⏳ Marcar como Pendente
              </button>
            </div>
          </div>

          {/* Card: Preferência de Almoço e Observações do Cliente */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 space-y-2 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              🍽️ Almoço & Observações do Cliente
            </span>
            <p className="text-xs sm:text-sm text-slate-200">
              <strong>Preferência de Refeição:</strong> {booking.lunchPreference}
            </p>
            {booking.clientNotes ? (
              <div className="rounded-xl bg-white/5 p-3 border border-white/10 text-xs sm:text-sm text-slate-300">
                <strong>Pedido Especial do Cliente:</strong> &ldquo;{booking.clientNotes}&rdquo;
              </div>
            ) : null}
          </div>

          {/* Card: Anotações Internas da Agência */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                📝 Anotações Internas da Agência (Visível apenas para admins)
              </span>
              {notesFeedback && (
                <span className="text-xs font-bold text-emerald-400 animate-fadeIn">
                  {notesFeedback}
                </span>
              )}
            </div>

            <textarea
              rows={2}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Ex: Marinheiro Jorge designado. Cliente pediu para levar coolers extras com gelo..."
              className="w-full resize-none rounded-xl border border-white/15 bg-slate-950/50 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="px-4 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500 hover:text-slate-950 transition disabled:opacity-50 cursor-pointer"
              >
                {isSavingNotes ? "Salvando..." : "Salvar Anotações"}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Status do Passeio:</span>
                <button
                  type="button"
                  onClick={() => handleSetBookingStatus("realizado")}
                  disabled={booking.bookingStatus === "realizado"}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500 hover:text-white transition disabled:opacity-40 cursor-pointer"
                >
                  ✓ Marcar Realizado
                </button>
                <button
                  type="button"
                  onClick={() => handleSetBookingStatus("cancelado")}
                  disabled={booking.bookingStatus === "cancelado"}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition disabled:opacity-40 cursor-pointer"
                >
                  ✕ Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé com Fechar e Imprimir */}
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            <span>🖨️</span>
            <span>Imprimir Resumo da Reserva</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 hover:bg-white/20 px-6 py-2 text-sm font-bold text-white transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
