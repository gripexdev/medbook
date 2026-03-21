import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import type { AuthUser, SessionUser, UserRole } from "@/lib/types";

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type StoredUser = AuthUser & {
  passwordHash: string;
};

function mapStoredUser(row: UserRow): StoredUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    passwordHash: row.password_hash
  };
}

export function toSessionUser(user: Pick<AuthUser, "id" | "name" | "email" | "role">): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export function getConfiguredAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";
}

export function isAdminUser(user: Pick<SessionUser, "role" | "email"> | null | undefined) {
  if (!user || user.role !== "admin") {
    return false;
  }

  const configuredAdminEmail = getConfiguredAdminEmail();

  if (!configuredAdminEmail) {
    return true;
  }

  return user.email.trim().toLowerCase() === configuredAdminEmail;
}

export function findUserById(id: string) {
  const row = db
    .prepare("SELECT id, name, email, password_hash, role, created_at, updated_at FROM users WHERE id = ?")
    .get(id) as UserRow | undefined;

  return row ? mapStoredUser(row) : null;
}

export function findUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const row = db
    .prepare("SELECT id, name, email, password_hash, role, created_at, updated_at FROM users WHERE email = ?")
    .get(normalizedEmail) as UserRow | undefined;

  return row ? mapStoredUser(row) : null;
}

export function createUser({
  name,
  email,
  passwordHash,
  role = "client"
}: {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
}) {
  const now = new Date().toISOString();
  const user = {
    id: randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    role,
    createdAt: now,
    updatedAt: now
  };

  db.prepare(
    `
      INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
      VALUES (@id, @name, @email, @passwordHash, @role, @createdAt, @updatedAt)
    `
  ).run(user);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export function updateUserName(userId: string, name: string) {
  db.prepare("UPDATE users SET name = ?, updated_at = ? WHERE id = ?").run(
    name.trim(),
    new Date().toISOString(),
    userId
  );
}
