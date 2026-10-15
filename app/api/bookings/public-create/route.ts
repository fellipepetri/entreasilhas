import { NextResponse } from "next/server";
import { createBooking } from "@/lib/booking-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.nome || !body.telefone || !body.data || !body.roteiroNome) {
      return NextResponse.json(
        { error: "Dados obrigatórios não preenchidos." },
        { status: 400 }
      );
    }

    const totalAmount = Number(body.totalAmount) || 3800;
    const paidAmount = body.paymentMethod === "pix" ? Math.round(totalAmount / 2) : 0;
    const remainingAmount = totalAmount - paidAmount;
    const paymentStatus = paidAmount > 0 ? "pago_parcial" : "pendente";

    const newBooking = await createBooking({
      code: body.code || `EAI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: body.data,
      time: body.horario || "09:00h às 16:00h",
      tourTitle: body.roteiroNome,
      tourSlug: body.roteiroSlug || "ilha-dos-frades-guadalupe",
      boatName: body.boatName || "Lancha Coral 33ft — 'Mar Azul'",
      boardingLocation: body.boardingLocation || "Bahia Marina — Salvador/BA",
      client: {
        name: body.nome.trim(),
        email: body.email?.trim() || "",
        phone: body.telefone.trim(),
        cpf: body.cpf?.trim() || ""
      },
      guests: {
        adults: Number(body.adults) || 2,
        children: Number(body.children) || 0,
        totalGuests: (Number(body.adults) || 2) + (Number(body.children) || 0)
      },
      lunchPreference: body.lunchPreference || "Almoço em Restaurante na Ilha",
      includeSunset: Boolean(body.includeSunset),
      financial: {
        totalAmount,
        paidAmount,
        remainingAmount,
        paymentMethod: body.paymentMethod === "pix" ? "PIX" : body.paymentMethod === "cartao" ? "Cartão de Crédito" : "WhatsApp",
        paymentStatus,
        paidAt: paidAmount > 0 ? new Date().toISOString() : null
      },
      bookingStatus: "confirmado",
      notes: "Agendamento realizado diretamente pelo formulário online do site.",
      clientNotes: body.observacoes || ""
    });

    return NextResponse.json({
      success: true,
      booking: newBooking
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar reserva pública." },
      { status: 500 }
    );
  }
}
