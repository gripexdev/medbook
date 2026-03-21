import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import path from "path";

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

    CREATE INDEX IF NOT EXISTS idx_bookings_user_id
      ON bookings(user_id);

    CREATE INDEX IF NOT EXISTS idx_bookings_schedule
      ON bookings(preferred_date, preferred_time);

    CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_active_slot
      ON bookings(service_id, preferred_date, preferred_time)
      WHERE status = 'confirmed';
  `);
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
