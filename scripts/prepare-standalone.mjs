import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const standaloneDir = path.join(rootDir, ".next", "standalone");

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function copyIfPresent(source, destination) {
  if (!(await pathExists(source))) {
    return;
  }

  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.cp(source, destination, { recursive: true, force: true });
}

async function run() {
  if (!(await pathExists(standaloneDir))) {
    return;
  }

  await copyIfPresent(path.join(rootDir, ".next", "static"), path.join(standaloneDir, ".next", "static"));
  await copyIfPresent(path.join(rootDir, "public"), path.join(standaloneDir, "public"));
}

run().catch((error) => {
  console.error("Unable to prepare standalone assets.", error);
  process.exit(1);
});
