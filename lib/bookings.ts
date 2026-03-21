import { randomUUID } from "crypto";
import { siteConfig } from "@/config/site";
import { getLocalDateInputValue } from "@/lib/format";
import { getAvailableSlots } from "@/lib/availability";
import { db } from "@/lib/db";
import { getDateTimeFromBooking, getOccupiedSlotTimes } from "@/lib/schedule";
import { updateUserName } from "@/lib/users";
import type {
  BookingInput,
  BookingNotificationKind,
  BookingRecord,
  BookingStatus,
  SessionUser
} from "@/lib/types";

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
  confirmation_sent_at: string | null;
  cancellation_sent_at: string | null;
  reminder_sent_at: string | null;
};

type BookingStatusResult =
  | { booking: BookingRecord }
  | {
      error: string;
      status: number;
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
    updatedAt: row.updated_at,
    confirmationSentAt: row.confirmation_sent_at,
    cancellationSentAt: row.cancellation_sent_at,
    reminderSentAt: row.reminder_sent_at
  };
}

function getBaseBookingSelectQuery() {
  return `
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
      updated_at,
      confirmation_sent_at,
      cancellation_sent_at,
      reminder_sent_at
    FROM bookings
  `;
}

function findService(serviceId: string) {
  return siteConfig.services.find((service) => service.id === serviceId) || null;
}

function getServiceDurationMinutes(serviceId: string) {
  return findService(serviceId)?.durationMinutes || siteConfig.slotIntervalMinutes;
}

function insertBookingSlots(bookingId: string, date: string, time: string, durationMinutes: number) {
  const insertSlot = db.prepare(
    `
      INSERT INTO booking_slots (booking_id, slot_date, slot_time)
      VALUES (?, ?, ?)
    `
  );

  const occupiedTimes = getOccupiedSlotTimes(time, durationMinutes, siteConfig.slotIntervalMinutes);

  for (const slotTime of occupiedTimes) {
    insertSlot.run(bookingId, date, slotTime);
  }
}

function releaseBookingSlots(bookingId: string) {
  db.prepare("DELETE FROM booking_slots WHERE booking_id = ?").run(bookingId);
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
        ${getBaseBookingSelectQuery()}
        WHERE user_id = ?
        ORDER BY preferred_date ASC, preferred_time ASC, created_at DESC
      `
    )
    .all(userId) as BookingRow[];

  return rows.map(mapBooking);
}

export function listAllBookings() {
  const rows = db
    .prepare(
      `
        ${getBaseBookingSelectQuery()}
        ORDER BY preferred_date ASC, preferred_time ASC, created_at DESC
      `
    )
    .all() as BookingRow[];

  return rows.map(mapBooking);
}

export function getBookingById(bookingId: string) {
  const row = db
    .prepare(
      `
        ${getBaseBookingSelectQuery()}
        WHERE id = ?
      `
    )
    .get(bookingId) as BookingRow | undefined;

  return row ? mapBooking(row) : null;
}

export function getBookingByIdForUser(userId: string, bookingId: string) {
  const row = db
    .prepare(
      `
        ${getBaseBookingSelectQuery()}
        WHERE id = ? AND user_id = ?
      `
    )
    .get(bookingId, userId) as BookingRow | undefined;

  return row ? mapBooking(row) : null;
}

export function createBookingForUser(user: SessionUser, payload: BookingInput) {
  const service = findService(payload.serviceId);

  if (!service) {
    return { error: "Choose a valid service.", status: 400 } as const;
  }

  if (payload.email.trim().toLowerCase() !== user.email.toLowerCase()) {
    return {
      error: "Bookings must use the same email address as the signed-in account.",
      status: 400
    } as const;
  }

  if (payload.preferredDate < getLocalDateInputValue()) {
    return {
      error: "Preferred date must be today or later.",
      status: 400
    } as const;
  }

  const availableSlots = getAvailableSlots(payload.serviceId, payload.preferredDate);
  const requestedSlotAvailable = availableSlots.some((slot) => slot.time === payload.preferredTime);

  if (!requestedSlotAvailable) {
    return {
      error: "That appointment slot is no longer available. Please choose another time.",
      status: 409
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
    serviceName: service.name,
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

      insertBookingSlots(
        normalizedInput.id,
        normalizedInput.preferredDate,
        normalizedInput.preferredTime,
        service.durationMinutes
      );
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

function updateBookingStatusInternal(booking: BookingRecord, nextStatus: BookingStatus): BookingStatusResult {
  if (booking.status === nextStatus) {
    return { booking };
  }

  const now = new Date().toISOString();

  try {
    const transaction = db.transaction(() => {
      if (booking.status === "confirmed" && nextStatus !== "confirmed") {
        releaseBookingSlots(booking.id);
      }

      if (booking.status !== "confirmed" && nextStatus === "confirmed") {
        const durationMinutes = getServiceDurationMinutes(booking.serviceId);
        insertBookingSlots(booking.id, booking.preferredDate, booking.preferredTime, durationMinutes);
      }

      db.prepare("UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?").run(
        nextStatus,
        now,
        booking.id
      );
    });

    transaction();
  } catch (error) {
    if (isConstraintError(error)) {
      return {
        error: "The appointment can no longer be marked as confirmed because the slot is already taken.",
        status: 409
      };
    }

    throw error;
  }

  const updatedBooking = getBookingById(booking.id);

  if (!updatedBooking) {
    throw new Error("Booking status was updated but could not be loaded.");
  }

  return {
    booking: updatedBooking
  };
}

export function updateBookingStatusForUser(userId: string, bookingId: string, nextStatus: BookingStatus) {
  const booking = getBookingByIdForUser(userId, bookingId);

  if (!booking) {
    return null;
  }

  return updateBookingStatusInternal(booking, nextStatus);
}

export function updateBookingStatusAsAdmin(bookingId: string, nextStatus: BookingStatus) {
  const booking = getBookingById(bookingId);

  if (!booking) {
    return null;
  }

  return updateBookingStatusInternal(booking, nextStatus);
}

export function cancelBookingForUser(userId: string, bookingId: string) {
  return updateBookingStatusForUser(userId, bookingId, "cancelled");
}

export function markBookingNotificationSent(bookingId: string, kind: BookingNotificationKind) {
  const columnName =
    kind === "confirmation"
      ? "confirmation_sent_at"
      : kind === "cancellation"
        ? "cancellation_sent_at"
        : "reminder_sent_at";

  db.prepare(`UPDATE bookings SET ${columnName} = ? WHERE id = ?`).run(
    new Date().toISOString(),
    bookingId
  );
}

export function listReminderCandidates(leadHours: number) {
  const bookings = db
    .prepare(
      `
        ${getBaseBookingSelectQuery()}
        WHERE status = 'confirmed' AND reminder_sent_at IS NULL
        ORDER BY preferred_date ASC, preferred_time ASC
      `
    )
    .all() as BookingRow[];

  const now = new Date();
  const cutoff = new Date(now.getTime() + leadHours * 60 * 60 * 1000);

  return bookings
    .map(mapBooking)
    .filter((booking) => {
      const bookingDateTime = getDateTimeFromBooking(booking.preferredDate, booking.preferredTime);
      return bookingDateTime >= now && bookingDateTime <= cutoff;
    });
}
