import { randomUUID } from "crypto";
import { siteConfig } from "@/config/site";
import { db } from "@/lib/db";
import { formatBookingTime, getLocalDateInputValue } from "@/lib/format";
import { generateWindowStartTimes, getOccupiedSlotTimes } from "@/lib/schedule";
import type {
  AvailabilityWindowInput,
  AvailabilityWindowRecord,
  AvailableDate,
  AvailableSlot,
  BlackoutDateInput,
  BlackoutDateRecord
} from "@/lib/types";

type AvailabilityWindowRow = {
  id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
};

type BlackoutDateRow = {
  id: string;
  date: string;
  reason: string;
  created_at: string;
  updated_at: string;
};

function mapAvailabilityWindow(row: AvailabilityWindowRow): AvailabilityWindowRecord {
  return {
    id: row.id,
    weekday: row.weekday,
    startTime: row.start_time,
    endTime: row.end_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapBlackoutDate(row: BlackoutDateRow): BlackoutDateRecord {
  return {
    id: row.id,
    date: row.date,
    reason: row.reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof error.code === "string" &&
    error.code.startsWith("SQLITE_CONSTRAINT")
  );
}

export function listAvailabilityWindows() {
  const rows = db
    .prepare(
      `
        SELECT id, weekday, start_time, end_time, created_at, updated_at
        FROM availability_windows
        ORDER BY weekday ASC, start_time ASC
      `
    )
    .all() as AvailabilityWindowRow[];

  return rows.map(mapAvailabilityWindow);
}

export function listBlackoutDates() {
  const rows = db
    .prepare(
      `
        SELECT id, date, reason, created_at, updated_at
        FROM blackout_dates
        ORDER BY date ASC
      `
    )
    .all() as BlackoutDateRow[];

  return rows.map(mapBlackoutDate);
}

export function createAvailabilityWindow(input: AvailabilityWindowInput) {
  const now = new Date().toISOString();
  const record = {
    id: randomUUID(),
    weekday: input.weekday,
    startTime: input.startTime,
    endTime: input.endTime,
    createdAt: now,
    updatedAt: now
  };

  db.prepare(
    `
      INSERT INTO availability_windows (id, weekday, start_time, end_time, created_at, updated_at)
      VALUES (@id, @weekday, @startTime, @endTime, @createdAt, @updatedAt)
    `
  ).run(record);

  return listAvailabilityWindows();
}

export function deleteAvailabilityWindow(id: string) {
  return db.prepare("DELETE FROM availability_windows WHERE id = ?").run(id).changes > 0;
}

export function createBlackoutDate(input: BlackoutDateInput) {
  const now = new Date().toISOString();
  const record = {
    id: randomUUID(),
    date: input.date,
    reason: input.reason.trim(),
    createdAt: now,
    updatedAt: now
  };

  try {
    db.prepare(
      `
        INSERT INTO blackout_dates (id, date, reason, created_at, updated_at)
        VALUES (@id, @date, @reason, @createdAt, @updatedAt)
      `
    ).run(record);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        error: "That date is already blocked.",
        status: 409
      } as const;
    }

    throw error;
  }

  return {
    blackouts: listBlackoutDates()
  } as const;
}

export function deleteBlackoutDate(id: string) {
  return db.prepare("DELETE FROM blackout_dates WHERE id = ?").run(id).changes > 0;
}

function isDateBlocked(date: string) {
  return Boolean(
    db.prepare("SELECT id FROM blackout_dates WHERE date = ? LIMIT 1").get(date) as { id: string } | undefined
  );
}

function formatAvailableDateLabel(date: string) {
  const targetDate = new Date(`${date}T00:00:00`);
  const today = new Date(`${getLocalDateInputValue()}T00:00:00`);
  const diffDays = Math.round((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "Tomorrow";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(targetDate);
}

export function getAvailableSlots(serviceId: string, date: string) {
  if (!serviceId || !date || date < getLocalDateInputValue()) {
    return [] as AvailableSlot[];
  }

  const service = siteConfig.services.find((item) => item.id === serviceId);

  if (!service || isDateBlocked(date)) {
    return [] as AvailableSlot[];
  }

  const weekday = new Date(`${date}T00:00:00`).getDay();
  const windows = db
    .prepare(
      `
        SELECT id, weekday, start_time, end_time, created_at, updated_at
        FROM availability_windows
        WHERE weekday = ?
        ORDER BY start_time ASC
      `
    )
    .all(weekday) as AvailabilityWindowRow[];

  if (windows.length === 0) {
    return [] as AvailableSlot[];
  }

  const occupiedTimes = new Set(
    (
      db
        .prepare("SELECT slot_time FROM booking_slots WHERE slot_date = ?")
        .all(date) as Array<{ slot_time: string }>
    ).map((row) => row.slot_time)
  );
  const availableSlots: AvailableSlot[] = [];
  const seen = new Set<string>();

  for (const window of windows) {
    const startTimes = generateWindowStartTimes(
      window.start_time,
      window.end_time,
      service.durationMinutes,
      siteConfig.slotIntervalMinutes
    );

    for (const startTime of startTimes) {
      if (seen.has(startTime)) {
        continue;
      }

      const requiredUnits = getOccupiedSlotTimes(
        startTime,
        service.durationMinutes,
        siteConfig.slotIntervalMinutes
      );

      if (requiredUnits.some((slotTime) => occupiedTimes.has(slotTime))) {
        continue;
      }

      seen.add(startTime);
      availableSlots.push({
        time: startTime,
        label: formatBookingTime(startTime)
      });
    }
  }

  return availableSlots.sort((left, right) => left.time.localeCompare(right.time));
}

export function getAvailableDates(serviceId: string, daysAhead = siteConfig.bookingWindowDays) {
  if (!siteConfig.services.some((service) => service.id === serviceId)) {
    return [] as AvailableDate[];
  }

  const safeDaysAhead = Math.max(1, Math.min(daysAhead || siteConfig.bookingWindowDays, 60));
  const startDate = new Date(`${getLocalDateInputValue()}T00:00:00`);
  const availableDates: AvailableDate[] = [];

  for (let offset = 0; offset < safeDaysAhead; offset += 1) {
    const candidateDate = new Date(startDate);
    candidateDate.setDate(startDate.getDate() + offset);

    const date = getLocalDateInputValue(candidateDate);
    const slots = getAvailableSlots(serviceId, date);

    if (slots.length === 0) {
      continue;
    }

    availableDates.push({
      date,
      label: formatAvailableDateLabel(date),
      slotCount: slots.length
    });
  }

  return availableDates;
}
