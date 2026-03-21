import { randomUUID } from "crypto";
import { siteConfig } from "@/config/site";
import { db } from "@/lib/db";
import { updateUserName } from "@/lib/users";
import type { BookingInput, BookingRecord, BookingStatus, SessionUser } from "@/lib/types";

type BookingRow = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  service_id: string;
  service_name: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
};

function mapBooking(row: BookingRow): BookingRecord {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    serviceId: row.service_id,
    serviceName: row.service_name,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function findServiceName(serviceId: string) {
  return siteConfig.services.find((service) => service.id === serviceId)?.name || null;
}

function isConstraintError(error: unknown) {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof error.code === "string" &&
    error.code.startsWith("SQLITE_CONSTRAINT")
  );
}

export function listBookingsForUser(userId: string) {
  const rows = db
    .prepare(
      `
        SELECT
          id,
          user_id,
          full_name,
          email,
          phone,
          service_id,
          service_name,
          preferred_date,
          preferred_time,
          notes,
          status,
          created_at,
          updated_at
        FROM bookings
        WHERE user_id = ?
        ORDER BY preferred_date ASC, preferred_time ASC, created_at DESC
      `
    )
    .all(userId) as BookingRow[];

  return rows.map(mapBooking);
}

export function getBookingByIdForUser(userId: string, bookingId: string) {
  const row = db
    .prepare(
      `
        SELECT
          id,
          user_id,
          full_name,
          email,
          phone,
          service_id,
          service_name,
          preferred_date,
          preferred_time,
          notes,
          status,
          created_at,
          updated_at
        FROM bookings
        WHERE id = ? AND user_id = ?
      `
    )
    .get(bookingId, userId) as BookingRow | undefined;

  return row ? mapBooking(row) : null;
}

export function createBookingForUser(user: SessionUser, payload: BookingInput) {
  const serviceName = findServiceName(payload.serviceId);

  if (!serviceName) {
    return { error: "Choose a valid service.", status: 400 } as const;
  }

  if (payload.email.trim().toLowerCase() !== user.email.toLowerCase()) {
    return {
      error: "Bookings must use the same email address as the signed-in account.",
      status: 400
    } as const;
  }

  const now = new Date().toISOString();
  const bookingId = randomUUID();
  const normalizedInput = {
    id: bookingId,
    userId: user.id,
    fullName: payload.fullName.trim(),
    email: user.email,
    phone: payload.phone.trim(),
    serviceId: payload.serviceId,
    serviceName,
    preferredDate: payload.preferredDate,
    preferredTime: payload.preferredTime,
    notes: payload.notes.trim(),
    status: "confirmed" as const,
    createdAt: now,
    updatedAt: now
  };

  try {
    const transaction = db.transaction(() => {
      if (normalizedInput.fullName !== user.name) {
        updateUserName(user.id, normalizedInput.fullName);
      }

      db.prepare(
        `
          INSERT INTO bookings (
            id,
            user_id,
            full_name,
            email,
            phone,
            service_id,
            service_name,
            preferred_date,
            preferred_time,
            notes,
            status,
            created_at,
            updated_at
          )
          VALUES (
            @id,
            @userId,
            @fullName,
            @email,
            @phone,
            @serviceId,
            @serviceName,
            @preferredDate,
            @preferredTime,
            @notes,
            @status,
            @createdAt,
            @updatedAt
          )
        `
      ).run(normalizedInput);
    });

    transaction();
  } catch (error) {
    if (isConstraintError(error)) {
      return {
        error: "That appointment slot is already booked. Please choose another time.",
        status: 409
      } as const;
    }

    throw error;
  }

  const booking = getBookingByIdForUser(user.id, bookingId);

  if (!booking) {
    throw new Error("Booking was created but could not be loaded.");
  }

  return { booking } as const;
}

export function cancelBookingForUser(userId: string, bookingId: string) {
  const existingBooking = getBookingByIdForUser(userId, bookingId);

  if (!existingBooking) {
    return null;
  }

  if (existingBooking.status === "cancelled") {
    return existingBooking;
  }

  db.prepare("UPDATE bookings SET status = 'cancelled', updated_at = ? WHERE id = ? AND user_id = ?").run(
    new Date().toISOString(),
    bookingId,
    userId
  );

  return getBookingByIdForUser(userId, bookingId);
}
