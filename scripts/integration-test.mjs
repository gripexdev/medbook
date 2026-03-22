import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const port = 3107;
const baseUrl = `http://127.0.0.1:${port}`;
const databasePath = path.join(rootDir, "data", "integration-test.db");

class SessionClient {
  constructor() {
    this.cookie = "";
  }

  async request(url, options = {}) {
    const headers = new Headers(options.headers || {});

    if (this.cookie) {
      headers.set("cookie", this.cookie);
    }

    const response = await fetch(url, {
      ...options,
      headers
    });
    const setCookie = response.headers.get("set-cookie");

    if (setCookie) {
      this.cookie = setCookie.split(";")[0];
    }

    return response;
  }
}

async function removeDatabaseFiles() {
  for (const suffix of ["", "-shm", "-wal"]) {
    await fs.rm(`${databasePath}${suffix}`, { force: true }).catch(() => {});
  }
}

async function waitForServer() {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 30000) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);

      if (response.ok) {
        return;
      }
    } catch {
      // server is still starting
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error("Timed out waiting for the MEDBOOK server to start.");
}

async function parseJson(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

function toDateString(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().split("T")[0];
}

function getNextBookableDate(startDate = new Date()) {
  const candidate = new Date(startDate);

  for (let offset = 1; offset <= 21; offset += 1) {
    candidate.setDate(startDate.getDate() + offset);

    if (candidate.getDay() !== 0) {
      return toDateString(candidate);
    }
  }

  throw new Error("Unable to find a bookable integration test date.");
}

async function run() {
  if (!(await fs
    .access(path.join(rootDir, ".next", "BUILD_ID"))
    .then(() => true)
    .catch(() => false))) {
    throw new Error("Build output is missing. Run `npm run build` before `npm run test:integration`.");
  }

  await removeDatabaseFiles();

  const server = spawn(
    process.execPath,
    [path.join(rootDir, ".next", "standalone", "server.js")],
    {
      cwd: rootDir,
      env: {
        ...process.env,
        NODE_ENV: "production",
        PORT: String(port),
        AUTH_SECRET: "integration-test-auth-secret",
        DATABASE_PATH: databasePath,
        ADMIN_NAME: "MEDBOOK Admin",
        ADMIN_EMAIL: "admin@medbook.local",
        ADMIN_PASSWORD: "AdminPass123",
        APP_URL: baseUrl,
        CRON_SECRET: "integration-test-cron-secret"
      },
      stdio: ["ignore", "pipe", "pipe"]
    }
  );

  let serverOutput = "";
  server.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  try {
    await waitForServer();

    const futureBookingDate = getNextBookableDate();
    const blackoutDate = getNextBookableDate(new Date(`${futureBookingDate}T00:00:00`));
    const clientOne = new SessionClient();
    const clientTwo = new SessionClient();
    const adminClient = new SessionClient();

    const registerOneResponse = await clientOne.request(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Alex Carter",
        email: "alex@example.com",
        password: "SecurePass123",
        confirmPassword: "SecurePass123"
      })
    });
    assert.equal(registerOneResponse.status, 201, "client registration should succeed");

    const sessionResponse = await clientOne.request(`${baseUrl}/api/auth/session`);
    const sessionPayload = await parseJson(sessionResponse);
    assert.equal(sessionResponse.status, 200);
    assert.equal(sessionPayload.user.email, "alex@example.com");

    const forbiddenAdminResponse = await clientOne.request(`${baseUrl}/api/admin/bookings`);
    assert.equal(forbiddenAdminResponse.status, 403, "clients must not access admin routes");

    const datesResponse = await fetch(
      `${baseUrl}/api/availability/dates?serviceId=initial-consultation&days=21`
    );
    const datesPayload = await parseJson(datesResponse);
    assert.equal(datesResponse.status, 200);
    assert.ok(
      datesPayload.dates.some((date) => date.date === futureBookingDate),
      "available dates should include the upcoming bookable day"
    );

    const slotsResponse = await fetch(
      `${baseUrl}/api/availability/slots?serviceId=initial-consultation&date=${futureBookingDate}`
    );
    const slotsPayload = await parseJson(slotsResponse);
    assert.equal(slotsResponse.status, 200);
    assert.ok(slotsPayload.slots.length > 0, "slot API should return available slots");

    const bookingResponse = await clientOne.request(`${baseUrl}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName: "Alex Carter",
        email: "alex@example.com",
        phone: "(555) 555-0101",
        serviceId: "initial-consultation",
        preferredDate: futureBookingDate,
        preferredTime: slotsPayload.slots[0].time,
        notes: "Integration booking."
      })
    });
    const bookingPayload = await parseJson(bookingResponse);
    assert.equal(bookingResponse.status, 201, "booking creation should succeed");

    const postBookingSlotsResponse = await fetch(
      `${baseUrl}/api/availability/slots?serviceId=initial-consultation&date=${futureBookingDate}`
    );
    const postBookingSlotsPayload = await parseJson(postBookingSlotsResponse);
    assert.equal(postBookingSlotsResponse.status, 200);
    assert.ok(
      postBookingSlotsPayload.slots.every((slot) => slot.time !== bookingPayload.booking.preferredTime),
      "confirmed bookings should remove the reserved slot from availability"
    );

    const registerTwoResponse = await clientTwo.request(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Casey Morgan",
        email: "casey@example.com",
        password: "SecurePass123",
        confirmPassword: "SecurePass123"
      })
    });
    assert.equal(registerTwoResponse.status, 201, "second client registration should succeed");

    const conflictResponse = await clientTwo.request(`${baseUrl}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName: "Casey Morgan",
        email: "casey@example.com",
        phone: "(555) 555-0102",
        serviceId: "initial-consultation",
        preferredDate: futureBookingDate,
        preferredTime: slotsPayload.slots[0].time,
        notes: "Conflict attempt."
      })
    });
    assert.equal(conflictResponse.status, 409, "duplicate booking should be blocked");

    const adminLoginResponse = await adminClient.request(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "admin@medbook.local",
        password: "AdminPass123"
      })
    });
    assert.equal(adminLoginResponse.status, 200, "admin login should succeed");

    const adminBookingsResponse = await adminClient.request(`${baseUrl}/api/admin/bookings`);
    const adminBookingsPayload = await parseJson(adminBookingsResponse);
    assert.equal(adminBookingsResponse.status, 200, "admin should list all bookings");
    assert.ok(adminBookingsPayload.bookings.length >= 1, "admin bookings list should not be empty");
    assert.equal(adminBookingsPayload.pagination.page, 1, "admin bookings should include pagination meta");
    assert.ok(typeof adminBookingsPayload.summary.total === "number", "admin bookings should include summary stats");

    const blackoutResponse = await adminClient.request(`${baseUrl}/api/admin/availability/blackouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date: blackoutDate,
        reason: "Integration blackout"
      })
    });
    assert.equal(blackoutResponse.status, 201, "admin should add blackout dates");

    const blockedSlotsResponse = await fetch(
      `${baseUrl}/api/availability/slots?serviceId=initial-consultation&date=${blackoutDate}`
    );
    const blockedSlotsPayload = await parseJson(blockedSlotsResponse);
    assert.equal(blockedSlotsResponse.status, 200);
    assert.equal(blockedSlotsPayload.slots.length, 0, "blackout dates should remove all slots");

    const blockedDatesResponse = await fetch(
      `${baseUrl}/api/availability/dates?serviceId=initial-consultation&days=21`
    );
    const blockedDatesPayload = await parseJson(blockedDatesResponse);
    assert.equal(blockedDatesResponse.status, 200);
    assert.ok(
      blockedDatesPayload.dates.every((date) => date.date !== blackoutDate),
      "blackout dates should disappear from the available dates list"
    );

    const statusUpdateResponse = await adminClient.request(
      `${baseUrl}/api/admin/bookings/${bookingPayload.booking.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "completed"
        })
      }
    );
    const statusUpdatePayload = await parseJson(statusUpdateResponse);
    assert.equal(statusUpdateResponse.status, 200, "admin should update booking status");
    assert.equal(statusUpdatePayload.booking.status, "completed");

    const releasedSlotsResponse = await fetch(
      `${baseUrl}/api/availability/slots?serviceId=initial-consultation&date=${futureBookingDate}`
    );
    const releasedSlotsPayload = await parseJson(releasedSlotsResponse);
    assert.equal(releasedSlotsResponse.status, 200);
    assert.ok(
      releasedSlotsPayload.slots.some((slot) => slot.time === bookingPayload.booking.preferredTime),
      "completed bookings should release the slot back into availability"
    );

    const cronResponse = await fetch(`${baseUrl}/api/cron/reminders`, {
      method: "POST",
      headers: {
        Authorization: "Bearer integration-test-cron-secret"
      }
    });
    assert.equal(cronResponse.status, 200, "authorized reminder cron should succeed");

    const logoutResponse = await clientOne.request(`${baseUrl}/api/auth/logout`, {
      method: "POST"
    });
    assert.equal(logoutResponse.status, 200, "logout should succeed");

    const postLogoutBookingsResponse = await clientOne.request(`${baseUrl}/api/bookings`);
    assert.equal(postLogoutBookingsResponse.status, 401, "logged out users should not access bookings");

    console.log("Integration checks passed.");
  } finally {
    server.kill("SIGTERM");
    await new Promise((resolve) => server.on("exit", resolve));
    await removeDatabaseFiles();

    if (serverOutput.trim()) {
      console.log(serverOutput.trim());
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
