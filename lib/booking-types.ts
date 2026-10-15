export type PaymentStatus = "pago_total" | "pago_parcial" | "pendente" | "reembolsado";

export type BookingStatus = "confirmado" | "realizado" | "cancelado";

export interface BookingClient {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export interface BookingFinancial {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: "PIX" | "Cartão de Crédito" | "WhatsApp" | "Dinheiro" | "Transferência";
  paymentStatus: PaymentStatus;
  paidAt: string | null;
}

export interface BookingGuests {
  adults: number;
  children: number;
  totalGuests: number;
}

export interface BookingItem {
  id: string;
  code: string;
  createdAt: string;
  date: string; // YYYY-MM-DD
  time: string; // ex: "09:00h às 16:00h"
  tourTitle: string;
  tourSlug: string;
  boatName: string;
  boardingLocation: string;
  client: BookingClient;
  guests: BookingGuests;
  lunchPreference: string;
  includeSunset: boolean;
  financial: BookingFinancial;
  bookingStatus: BookingStatus;
  notes: string;
  clientNotes: string;
}

export interface BlockedDate {
  date: string; // YYYY-MM-DD
  reason: string;
  createdAt: string;
}

export interface BookingStoreData {
  bookings: BookingItem[];
  blockedDates: BlockedDate[];
  updatedAt: string;
}
