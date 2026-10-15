import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/admin-auth";
import {
  getBookingsData,
  saveBookingsData,
  updateBooking,
  createBooking,
  deleteBooking,
  toggleDateBlock
} from "@/lib/booking-store";

export async function GET(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const data = await getBookingsData();

    // Calcula métricas para o painel
    const todayStr = new Date().toISOString().split("T")[0];

    const totalBookings = data.bookings.length;
    const upcomingBookings = data.bookings.filter(
      (b) => b.bookingStatus === "confirmado" && b.date >= todayStr
    );
    const realizedBookings = data.bookings.filter(
      (b) => b.bookingStatus === "realizado" || (b.bookingStatus === "confirmado" && b.date < todayStr)
    );
    const fullyPaidBookings = data.bookings.filter(
      (b) => b.financial.paymentStatus === "pago_total"
    );
    const partialPaidBookings = data.bookings.filter(
      (b) => b.financial.paymentStatus === "pago_parcial"
    );
    const pendingPaidBookings = data.bookings.filter(
      (b) => b.financial.paymentStatus === "pendente"
    );

    const totalRevenue = data.bookings
      .filter((b) => b.bookingStatus !== "cancelado")
      .reduce((acc, b) => acc + (b.financial.paidAmount || 0), 0);

    const pendingRevenue = data.bookings
      .filter((b) => b.bookingStatus === "confirmado")
      .reduce((acc, b) => acc + (b.financial.remainingAmount || 0), 0);

    const totalPassengers = data.bookings
      .filter((b) => b.bookingStatus !== "cancelado")
      .reduce((acc, b) => acc + (b.guests.totalGuests || 0), 0);

    return NextResponse.json({
      success: true,
      data,
      summary: {
        totalBookings,
        upcomingCount: upcomingBookings.length,
        realizedCount: realizedBookings.length,
        fullyPaidCount: fullyPaidBookings.length,
        partialPaidCount: partialPaidBookings.length,
        pendingCount: pendingPaidBookings.length,
        totalRevenue,
        pendingRevenue,
        totalPassengers
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar dados de agendamentos." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Ação especial: Alternar bloqueio de data
    if (body.action === "toggle_block" && body.date) {
      const isNowBlocked = await toggleDateBlock(body.date, body.reason);
      const data = await getBookingsData();
      return NextResponse.json({
        success: true,
        message: isNowBlocked ? "Data bloqueada com sucesso." : "Data desbloqueada com sucesso.",
        isNowBlocked,
        data
      });
    }

    // Ação: Criar nova reserva
    if (!body.client?.name || !body.date || !body.tourTitle) {
      return NextResponse.json(
        { error: "Dados incompletos para criação de reserva." },
        { status: 400 }
      );
    }

    const newBooking = await createBooking(body);
    const data = await getBookingsData();

    return NextResponse.json({
      success: true,
      message: "Reserva criada com sucesso!",
      booking: newBooking,
      data
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar criação de reserva." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...partial } = body || {};

    if (!id) {
      return NextResponse.json(
        { error: "ID da reserva é obrigatório." },
        { status: 400 }
      );
    }

    const updated = await updateBooking(id, partial);
    if (!updated) {
      return NextResponse.json(
        { error: "Reserva não encontrada." },
        { status: 404 }
      );
    }

    const data = await getBookingsData();

    return NextResponse.json({
      success: true,
      message: "Reserva atualizada com sucesso!",
      booking: updated,
      data
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar reserva." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID da reserva é obrigatório." },
        { status: 400 }
      );
    }

    const success = await deleteBooking(id);
    if (!success) {
      return NextResponse.json(
        { error: "Reserva não encontrada para exclusão." },
        { status: 404 }
      );
    }

    const data = await getBookingsData();

    return NextResponse.json({
      success: true,
      message: "Reserva removida com sucesso!",
      data
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao excluir reserva." },
      { status: 500 }
    );
  }
}
