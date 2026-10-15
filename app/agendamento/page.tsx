import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingPageContent } from "@/components/booking/booking-page-content";

export const metadata: Metadata = {
  title: "Agendamento de Passeio Náutico | Entre as Ilhas — Turismo Náutico",
  description:
    "Personalize seu passeio de lancha privativo pela Baía de Todos-os-Santos: escolha data, passageiros, roteiro exclusivo, preferência de almoço e formalize sua reserva."
};

function BookingLoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-brand-deep">Carregando sistema de agendamento...</p>
      </div>
    </div>
  );
}

export default function AgendamentoPage() {
  return (
    <Suspense fallback={<BookingLoadingFallback />}>
      <BookingPageContent />
    </Suspense>
  );
}
