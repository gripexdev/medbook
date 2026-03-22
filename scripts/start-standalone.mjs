import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";

const rootDir = process.cwd();
const nodeEnv = process.env.NODE_ENV || "production";
const serverPath = path.join(rootDir, ".next", "standalone", "server.js");

function parseEnvLine(line) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const normalized = trimmed.startsWith("export ") ? trimmed.slice(7).trim() : trimmed;
  const separatorIndex = normalized.indexOf("=");

  if (separatorIndex <= 0) {
    return null;
  }

  const key = normalized.slice(0, separatorIndex).trim();
  let value = normalized.slice(separatorIndex + 1).trim();

  if (!key) {
    return null;
  }

  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  value = value.replace(/\\n/g, "\n");

  return { key, value };
}

async function loadEnvFile(filePath, env) {
  try {
    const content = await fs.readFile(filePath, "utf8");

    for (const line of content.split(/\r?\n/)) {
      const parsed = parseEnvLine(line);

      if (!parsed || env[parsed.key] !== undefined) {
        continue;
      }

      env[parsed.key] = parsed.value;
    }
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") {
      throw error;
    }
  }
}

async function buildRuntimeEnv() {
  const env = { ...process.env };
  const envFiles = [
    path.join(rootDir, ".env"),
    path.join(rootDir, `.env.${nodeEnv}`),
    path.join(rootDir, ".env.local"),
    path.join(rootDir, `.env.${nodeEnv}.local`)
  ];

  for (const filePath of envFiles.reverse()) {
    await loadEnvFile(filePath, env);
  }

  return env;
}

function applyCliOverrides(env) {
  const args = process.argv.slice(2);

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const nextValue = args[index + 1];

    if ((arg === "--port" || arg === "-p") && nextValue) {
      env.PORT = nextValue;
      index += 1;
      continue;
    }

    if ((arg === "--hostname" || arg === "-H") && nextValue) {
      env.HOSTNAME = nextValue;
      index += 1;
    }
  }
}

async function run() {
  const env = await buildRuntimeEnv();
  applyCliOverrides(env);

  const child = spawn(process.execPath, [serverPath], {
    cwd: rootDir,
    env,
    stdio: "inherit"
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });

  process.on("SIGINT", () => child.kill("SIGINT"));
  process.on("SIGTERM", () => child.kill("SIGTERM"));
}

run().catch((error) => {
  console.error("Unable to start the MEDBOOK standalone server.", error);
  process.exit(1);
});
