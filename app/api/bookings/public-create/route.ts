import { NextResponse } from "next/server";
import { createBooking } from "@/lib/booking-store";
import { sendTransactionalEmail } from "@/lib/admin-security";

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

    // Envia email de notificação de nova reserva para entreasilhasturismo@gmail.com
    sendTransactionalEmail({
      to: "entreasilhasturismo@gmail.com",
      replyTo: newBooking.client.email || undefined,
      subject: `⛵ Nova Reserva no Site: ${newBooking.client.name} — ${newBooking.tourTitle}`,
      text: `Nova reserva confirmada pelo site:\nCódigo: ${newBooking.code}\nCliente: ${newBooking.client.name}\nWhatsApp: ${newBooking.client.phone}\nData: ${newBooking.date} (${newBooking.time})\nRoteiro: ${newBooking.tourTitle}\nPassageiros: ${newBooking.guests.totalGuests}\nValor Total: R$ ${newBooking.financial.totalAmount}\nStatus: ${newBooking.financial.paymentStatus}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px;">
            <h2 style="color: #0b2244; margin: 0; font-size: 18px;">⛵ Nova Reserva Confirmada pelo Site!</h2>
            <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Um cliente realizou um agendamento online na Entre as Ilhas.</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Código da Reserva:</strong></td><td style="padding: 6px 0; color: #0284c7; font-weight: bold;">${newBooking.code}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>Cliente:</strong></td><td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${newBooking.client.name}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>WhatsApp:</strong></td><td style="padding: 6px 0; color: #16a34a; font-weight: bold;"><a href="https://wa.me/${newBooking.client.phone.replace(/\D/g, "")}" style="color: #16a34a; text-decoration: none;">${newBooking.client.phone} ↗</a></td></tr>
            ${newBooking.client.email ? `<tr><td style="padding: 6px 0; color: #64748b;"><strong>E-mail:</strong></td><td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${newBooking.client.email}" style="color: #0284c7; text-decoration: none;">${newBooking.client.email}</a></td></tr>` : ""}
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>Data do Passeio:</strong></td><td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${newBooking.date} (${newBooking.time})</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>Roteiro Escolhido:</strong></td><td style="padding: 6px 0; color: #0f172a;">${newBooking.tourTitle}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>Passageiros:</strong></td><td style="padding: 6px 0; color: #0f172a;">${newBooking.guests.adults} adultos + ${newBooking.guests.children} crianças (${newBooking.guests.totalGuests} total)</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>Valor Total:</strong></td><td style="padding: 6px 0; color: #16a34a; font-weight: bold;">R$ ${newBooking.financial.totalAmount.toLocaleString("pt-BR")}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>Pagamento:</strong></td><td style="padding: 6px 0; color: #0f172a;">${newBooking.financial.paymentMethod} (${newBooking.financial.paymentStatus})</td></tr>
          </table>
          ${newBooking.clientNotes ? `<div style="margin-top: 16px; padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0284c7;"><strong style="font-size: 13px;">Observações do Cliente:</strong><p style="margin: 4px 0 0 0; font-size: 13px; color: #334155;">${newBooking.clientNotes}</p></div>` : ""}
          <p style="margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: center;">Entre as Ilhas • Gestão Náutica & Reservas</p>
        </div>
      `
    }).catch((err) => console.error("Erro no envio do email de reserva:", err));

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
