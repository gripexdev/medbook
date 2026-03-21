import Database from "better-sqlite3";
import { hashSync } from "bcryptjs";
import { randomUUID } from "crypto";
import { mkdirSync } from "fs";
import path from "path";
import { siteConfig } from "@/config/site";
import { getOccupiedSlotTimes } from "@/lib/schedule";

const globalForDatabase = globalThis as typeof globalThis & {
  medbookDatabase?: Database.Database;
};

function resolveDatabasePath() {
  const configuredPath = process.env.DATABASE_PATH?.trim();

  if (!configuredPath) {
    return path.join(process.cwd(), "data", "medbook.db");
  }

  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.join(process.cwd(), configuredPath);
}

function columnExists(database: Database.Database, tableName: string, columnName: string) {
  const columns = database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return columns.some((column) => column.name === columnName);
}

function ensureColumn(
  database: Database.Database,
  tableName: string,
  columnName: string,
  definition: string
) {
  if (!columnExists(database, tableName, columnName)) {
    database.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

function ensureAdminUser(database: Database.Database) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    return;
  }

  const now = new Date().toISOString();
  database.prepare(
    `
      INSERT OR IGNORE INTO users (id, name, email, password_hash, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'admin', ?, ?)
    `
  ).run(
    randomUUID(),
    process.env.ADMIN_NAME?.trim() || "MEDBOOK Admin",
    adminEmail,
    hashSync(adminPassword, 12),
    now,
    now
  );

  database
    .prepare(
      `
        UPDATE users
        SET name = ?, password_hash = ?, role = 'admin', updated_at = ?
        WHERE email = ?
      `
    )
    .run(
      process.env.ADMIN_NAME?.trim() || "MEDBOOK Admin",
      hashSync(adminPassword, 12),
      now,
      adminEmail
    );

  database.prepare("UPDATE users SET role = 'client', updated_at = ? WHERE email != ? AND role = 'admin'").run(
    now,
    adminEmail
  );
}

function ensureDefaultAvailability(database: Database.Database) {
  const { count } = database
    .prepare("SELECT COUNT(*) as count FROM availability_windows")
    .get() as { count: number };

  if (count > 0) {
    return;
  }

  const now = new Date().toISOString();
  const insertRule = database.prepare(
    `
      INSERT OR IGNORE INTO availability_windows (id, weekday, start_time, end_time, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `
  );

  for (const rule of siteConfig.defaultAvailability) {
    insertRule.run(randomUUID(), rule.weekday, rule.startTime, rule.endTime, now, now);
  }
}

function backfillBookingSlots(database: Database.Database) {
  const rows = database.prepare(
    `
      SELECT id, service_id, preferred_date, preferred_time, status
      FROM bookings
      WHERE status = 'confirmed'
    `
  ).all() as Array<{
    id: string;
    service_id: string;
    preferred_date: string;
    preferred_time: string;
    status: string;
  }>;

  const insertSlot = database.prepare(
    `
      INSERT OR IGNORE INTO booking_slots (booking_id, slot_date, slot_time)
      VALUES (?, ?, ?)
    `
  );

  for (const booking of rows) {
    const service = siteConfig.services.find((item) => item.id === booking.service_id);
    const durationMinutes = service?.durationMinutes || siteConfig.slotIntervalMinutes;
    const occupiedTimes = getOccupiedSlotTimes(
      booking.preferred_time,
      durationMinutes,
      siteConfig.slotIntervalMinutes
    );

    for (const slotTime of occupiedTimes) {
      insertSlot.run(booking.id, booking.preferred_date, slotTime);
    }
  }
}

function initializeDatabase(database: Database.Database) {
  database.pragma("foreign_keys = ON");
  database.pragma("journal_mode = WAL");

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'client',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      service_id TEXT NOT NULL,
      service_name TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      preferred_time TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS booking_slots (
      booking_id TEXT NOT NULL,
      slot_date TEXT NOT NULL,
      slot_time TEXT NOT NULL,
      PRIMARY KEY (slot_date, slot_time),
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS availability_windows (
      id TEXT PRIMARY KEY,
      weekday INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blackout_dates (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL UNIQUE,
      reason TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_bookings_user_id
      ON bookings(user_id);

    CREATE INDEX IF NOT EXISTS idx_bookings_schedule
      ON bookings(preferred_date, preferred_time);

    CREATE INDEX IF NOT EXISTS idx_booking_slots_booking_id
      ON booking_slots(booking_id);

    CREATE INDEX IF NOT EXISTS idx_availability_windows_weekday
      ON availability_windows(weekday);

    CREATE INDEX IF NOT EXISTS idx_blackout_dates_date
      ON blackout_dates(date);
  `);

  database.exec(`
    DELETE FROM availability_windows
    WHERE rowid NOT IN (
      SELECT MIN(rowid)
      FROM availability_windows
      GROUP BY weekday, start_time, end_time
    );
  `);

  database.exec("DROP INDEX IF EXISTS idx_bookings_active_slot");
  database.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_availability_windows_unique
      ON availability_windows(weekday, start_time, end_time)
  `);
  ensureColumn(database, "bookings", "confirmation_sent_at", "TEXT");
  ensureColumn(database, "bookings", "cancellation_sent_at", "TEXT");
  ensureColumn(database, "bookings", "reminder_sent_at", "TEXT");
  ensureAdminUser(database);
  ensureDefaultAvailability(database);
  backfillBookingSlots(database);
}

function createDatabase() {
  const databasePath = resolveDatabasePath();

  mkdirSync(path.dirname(databasePath), { recursive: true });

  const database = new Database(databasePath);
  initializeDatabase(database);

  return database;
}

export const db = globalForDatabase.medbookDatabase ?? createDatabase();

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.medbookDatabase = db;
}
