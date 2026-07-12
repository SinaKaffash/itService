import { readdir, readFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import nextEnv from "@next/env";
import path from "node:path";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd(), true);

const nextPath = path.join(process.cwd(), ".next");
const cachePath = path.join(nextPath, "cache");
const transientDevPaths = [
  cachePath,
  path.join(nextPath, "server"),
  path.join(nextPath, "static", "chunks"),
  path.join(nextPath, "types"),
];
const nextCliPath = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");

async function findInvalidJsonFiles(directory) {
  const invalidFiles = [];

  async function walk(currentDirectory) {
    let entries;
    try {
      entries = await readdir(currentDirectory, { withFileTypes: true });
    } catch (error) {
      if (error?.code === "ENOENT") {
        return;
      }
      throw error;
    }

    await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(currentDirectory, entry.name);

        if (entry.isDirectory()) {
          await walk(entryPath);
          return;
        }

        if (!entry.isFile() || !entry.name.endsWith(".json")) {
          return;
        }

        try {
          JSON.parse(await readFile(entryPath, "utf8"));
        } catch {
          invalidFiles.push(entryPath);
        }
      }),
    );
  }

  await walk(directory);
  return invalidFiles;
}

try {
  const invalidJsonFiles = await findInvalidJsonFiles(nextPath);

  if (invalidJsonFiles.length > 0) {
    await rm(nextPath, { force: true, recursive: true });
    console.log("Repaired malformed Next.js development state.");
  } else {
    await Promise.all(
      transientDevPaths.map((transientPath) =>
        rm(transientPath, { force: true, recursive: true }),
      ),
    );
    console.log("Repaired Next.js development cache.");
  }
} catch (error) {
  console.warn("Could not fully inspect Next.js development state:", error);

  try {
    await rm(cachePath, { force: true, recursive: true });
    console.log("Repaired Next.js development cache.");
  } catch (cacheError) {
    console.warn("Could not repair Next.js development cache:", cacheError);
  }
}

const devHostname = process.env.DEV_HOSTNAME || "0.0.0.0";

try {
  await rm(path.join(nextPath, "trace"), { force: true });
} catch {}

const child = spawn(process.execPath, [nextCliPath, "dev", "--hostname", devHostname], {
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
