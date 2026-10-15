"use client";

import { useState } from "react";
import { BOOKING_ROUTES } from "@/data/booking";
import type { BookingItem } from "@/lib/booking-types";

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  onCreateBooking: (booking: Omit<BookingItem, "id" | "createdAt">) => Promise<void>;
  onToggleBlockDate: (dateStr: string, reason?: string) => Promise<void>;
}

export function NewBookingModal({
  isOpen,
  onClose,
  initialDate,
  onCreateBooking,
  onToggleBlockDate
}: NewBookingModalProps) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = initialDate || tomorrow.toISOString().split("T")[0];

  const [mode, setMode] = useState<"reserva" | "bloqueio">("reserva");

  // Campos da Reserva
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [date, setDate] = useState(defaultDateStr);
  const [time, setTime] = useState("09:00h às 16:00h");
  const [selectedRouteSlug, setSelectedRouteSlug] = useState(BOOKING_ROUTES[0].slug);
  const [boatName, setBoatName] = useState("Lancha Coral 33ft — 'Mar Azul'");
  const [boardingLocation, setBoardingLocation] = useState("Bahia Marina — Salvador/BA");
  const [adults, setAdults] = useState(4);
  const [children, setChildren] = useState(0);
  const [totalAmount, setTotalAmount] = useState(3800);
  const [paidOption, setPaidOption] = useState<"total" | "sinal" | "pendente">("sinal");
  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "Cartão de Crédito" | "Dinheiro" | "WhatsApp">("PIX");
  const [lunchPreference, setLunchPreference] = useState("Almoço em Restaurante na Ilha");
  const [notes, setNotes] = useState("");

  // Campos do Bloqueio
  const [blockDate, setBlockDate] = useState(defaultDateStr);
  const [blockReason, setBlockReason] = useState("Manutenção preventiva da embarcação");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!nome.trim()) {
      setErrorMsg("Nome do cliente é obrigatório.");
      return;
    }
    if (!telefone.trim()) {
      setErrorMsg("Telefone do cliente é obrigatório.");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedTour = BOOKING_ROUTES.find((r) => r.slug === selectedRouteSlug) || BOOKING_ROUTES[0];
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const code = `EAI-${new Date().getFullYear()}-${randomCode}`;

      let paidAmount = 0;
      let paymentStatus: "pago_total" | "pago_parcial" | "pendente" = "pendente";

      if (paidOption === "total") {
        paidAmount = totalAmount;
        paymentStatus = "pago_total";
      } else if (paidOption === "sinal") {
        paidAmount = Math.round(totalAmount / 2);
        paymentStatus = "pago_parcial";
      }

      await onCreateBooking({
        code,
        date,
        time,
        tourTitle: selectedTour.name,
        tourSlug: selectedTour.slug,
        boatName,
        boardingLocation,
        client: {
          name: nome.trim(),
          email: email.trim() || `${nome.toLowerCase().replace(/\s+/g, "")}@cliente.com`,
          phone: telefone.trim(),
          cpf: cpf.trim() || "000.000.000-00"
        },
        guests: {
          adults: Number(adults),
          children: Number(children),
          totalGuests: Number(adults) + Number(children)
        },
        lunchPreference,
        includeSunset: time.includes("Pôr do Sol"),
        financial: {
          totalAmount: Number(totalAmount),
          paidAmount,
          remainingAmount: Math.max(0, Number(totalAmount) - paidAmount),
          paymentMethod,
          paymentStatus,
          paidAt: paidAmount > 0 ? new Date().toISOString() : null
        },
        bookingStatus: "confirmado",
        notes: notes.trim(),
        clientNotes: "Reserva inserida manualmente pelo painel administrativo."
      });

      onClose();
    } catch {
      setErrorMsg("Erro ao registrar a reserva. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate) return;

    setIsSubmitting(true);
    try {
      await onToggleBlockDate(blockDate, blockReason);
      onClose();
    } catch {
      setErrorMsg("Erro ao bloquear a data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/20 bg-gradient-to-b from-slate-900 via-slate-900 to-[#071d3a] p-5 sm:p-8 text-white shadow-2xl animate-scaleUp">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">➕</span>
            <div>
              <h3 className="text-xl font-extrabold text-white">
                {mode === "reserva" ? "Cadastrar Nova Reserva" : "Bloquear Data no Calendário"}
              </h3>
              <p className="text-xs text-slate-400">
                Adicione agendamentos recebidos pelo WhatsApp ou bloqueie datas para manutenção.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Alternador de Modo (Nova Reserva vs Bloquear Data) */}
        <div className="my-5 flex rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setMode("reserva")}
            className={[
              "flex-1 rounded-lg py-2 text-xs font-bold transition",
              mode === "reserva"
                ? "bg-cyan-500 text-slate-950 shadow-sm"
                : "text-slate-300 hover:text-white"
            ].join(" ")}
          >
            🛥️ Nova Reserva de Cliente
          </button>
          <button
            type="button"
            onClick={() => setMode("bloqueio")}
            className={[
              "flex-1 rounded-lg py-2 text-xs font-bold transition",
              mode === "bloqueio"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-slate-300 hover:text-white"
            ].join(" ")}
          >
            🚫 Bloquear Data (Manutenção)
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {mode === "reserva" ? (
          /* Formulário de Nova Reserva */
          <form onSubmit={handleSubmitBooking} className="space-y-4">
            {/* Dados do Cliente */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                1. Informações do Cliente
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silveira"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(71) 99999-9999"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cliente@email.com"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    CPF (Opcional)
                  </label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Detalhes do Passeio & Logística */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                2. Detalhes do Passeio
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Roteiro Náutico *
                  </label>
                  <select
                    value={selectedRouteSlug}
                    onChange={(e) => setSelectedRouteSlug(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {BOOKING_ROUTES.map((r) => (
                      <option key={r.slug} value={r.slug}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Data do Passeio *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Horário
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="09:00h às 16:00h">09:00h às 16:00h (Padrão 7h)</option>
                    <option value="09:00h às 17:30h (Com Pôr do Sol)">09:00h às 17:30h (Com Pôr do Sol)</option>
                    <option value="10:00h às 17:00h">10:00h às 17:00h</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Embarcação Designada
                  </label>
                  <input
                    type="text"
                    value={boatName}
                    onChange={(e) => setBoatName(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Passageiros (Adultos / Crianças)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-1/2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white text-center"
                      title="Adultos"
                    />
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-1/2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white text-center"
                      title="Crianças"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Local de Embarque
                  </label>
                  <input
                    type="text"
                    value={boardingLocation}
                    onChange={(e) => setBoardingLocation(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Financeiro */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                3. Financeiro & Pagamento
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Valor Total (R$) *
                  </label>
                  <input
                    type="number"
                    step={50}
                    required
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white font-bold focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Status Inicial do Pagamento
                  </label>
                  <select
                    value={paidOption}
                    onChange={(e) => setPaidOption(e.target.value as "total" | "sinal" | "pendente")}
                    className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="sinal">🪙 50% Pago (Sinal Recebido)</option>
                    <option value="total">✅ 100% Pago (Valor Total)</option>
                    <option value="pendente">⏳ Falta Pagar (Pendente)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as "PIX" | "Cartão de Crédito" | "Dinheiro" | "WhatsApp")}
                    className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="PIX">PIX</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Anotações */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Anotações Internas (Opcional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Cliente pediu marinheiro que fala inglês, cooler extra..."
                className="w-full resize-none rounded-xl border border-white/15 bg-white/5 p-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Botão de Envio */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[linear-gradient(135deg,#16c2c0,#1498d5)] hover:brightness-105 py-3 text-sm font-bold text-white shadow-lg transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Registrando Reserva..." : "Confirmar & Salvar Reserva"}
              </button>
            </div>
          </form>
        ) : (
          /* Formulário de Bloqueio de Data */
          <form onSubmit={handleSubmitBlock} className="space-y-4">
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300 block">
                🚫 Bloquear Dia no Calendário
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                A data selecionada não aceitará novas reservas no sistema de agendamento e ficará destacada como bloqueada no calendário.
              </p>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Data a Bloquear *
                </label>
                <input
                  type="date"
                  required
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Motivo do Bloqueio
                </label>
                <input
                  type="text"
                  required
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Ex: Manutenção preventiva dos motores"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-rose-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-rose-600 hover:bg-rose-500 py-3 text-sm font-bold text-white shadow-lg transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Salvando..." : "Confirmar Bloqueio da Data"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
