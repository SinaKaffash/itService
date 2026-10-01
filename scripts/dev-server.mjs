import { rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import nextEnv from "@next/env";
import path from "node:path";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd(), true);

const nextPath = path.join(process.cwd(), ".next");
const nextCliPath = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");

try {
  await rm(nextPath, { force: true, recursive: true });
  console.log("Cleared stale Next.js development state.");
} catch (error) {
  console.warn("Could not clear Next.js development state:", error);
}

const devHostname = process.env.DEV_HOSTNAME || "0.0.0.0";

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
