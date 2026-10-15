import fs from "fs/promises";
import path from "path";
import { DEFAULT_BOOKINGS_DATA } from "@/data/default-bookings";
import type { BookingItem, BookingStoreData } from "./booking-types";

const BOOKINGS_FILE_PATH = path.join(process.cwd(), "data", "bookings.json");

let memoryCache: BookingStoreData | null = null;

export async function getBookingsData(): Promise<BookingStoreData> {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    const raw = await fs.readFile(BOOKINGS_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as BookingStoreData;
    if (parsed && Array.isArray(parsed.bookings)) {
      memoryCache = parsed;
      return memoryCache;
    }
  } catch {
    // Arquivo não existe ou erro de leitura: cria com o padrão
  }

  memoryCache = DEFAULT_BOOKINGS_DATA;
  await saveBookingsData(DEFAULT_BOOKINGS_DATA);
  return memoryCache;
}

export async function saveBookingsData(data: BookingStoreData): Promise<BookingStoreData> {
  const payload: BookingStoreData = {
    ...data,
    updatedAt: new Date().toISOString()
  };

  try {
    const dir = path.dirname(BOOKINGS_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(BOOKINGS_FILE_PATH, JSON.stringify(payload, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar bookings.json no disco:", err);
  }

  memoryCache = payload;
  return payload;
}

export async function updateBooking(
  id: string,
  partial: Partial<BookingItem>
): Promise<BookingItem | null> {
  const current = await getBookingsData();
  const index = current.bookings.findIndex((b) => b.id === id);

  if (index === -1) {
    return null;
  }

  const existing = current.bookings[index];
  const updated: BookingItem = {
    ...existing,
    ...partial,
    client: {
      ...existing.client,
      ...(partial.client || {})
    },
    guests: {
      ...existing.guests,
      ...(partial.guests || {})
    },
    financial: {
      ...existing.financial,
      ...(partial.financial || {})
    }
  };

  // Recalcula remainingAmount se paidAmount ou totalAmount mudou
  if (partial.financial?.totalAmount !== undefined || partial.financial?.paidAmount !== undefined) {
    const total = updated.financial.totalAmount;
    const paid = updated.financial.paidAmount;
    updated.financial.remainingAmount = Math.max(0, total - paid);

    if (paid >= total && total > 0) {
      updated.financial.paymentStatus = "pago_total";
      if (!updated.financial.paidAt) {
        updated.financial.paidAt = new Date().toISOString();
      }
    } else if (paid > 0) {
      updated.financial.paymentStatus = "pago_parcial";
    } else {
      updated.financial.paymentStatus = "pendente";
    }
  }

  current.bookings[index] = updated;
  await saveBookingsData(current);
  return updated;
}

export async function createBooking(
  item: Omit<BookingItem, "id" | "createdAt">
): Promise<BookingItem> {
  const current = await getBookingsData();
  const id = `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();

  const total = item.financial.totalAmount;
  const paid = item.financial.paidAmount;
  const remaining = Math.max(0, total - paid);

  const newBooking: BookingItem = {
    ...item,
    id,
    createdAt,
    financial: {
      ...item.financial,
      remainingAmount: remaining
    }
  };

  current.bookings.unshift(newBooking);
  await saveBookingsData(current);
  return newBooking;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const current = await getBookingsData();
  const initialLen = current.bookings.length;
  current.bookings = current.bookings.filter((b) => b.id !== id);

  if (current.bookings.length !== initialLen) {
    await saveBookingsData(current);
    return true;
  }
  return false;
}

export async function toggleDateBlock(date: string, reason?: string): Promise<boolean> {
  const current = await getBookingsData();
  const existingIndex = current.blockedDates.findIndex((b) => b.date === date);

  if (existingIndex >= 0) {
    // Desbloqueia
    current.blockedDates.splice(existingIndex, 1);
    await saveBookingsData(current);
    return false; // agora está desbloqueada
  } else {
    // Bloqueia
    current.blockedDates.push({
      date,
      reason: reason || "Data bloqueada para afretamento",
      createdAt: new Date().toISOString()
    });
    await saveBookingsData(current);
    return true; // agora está bloqueada
  }
}
