import { rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const webpackCachePath = path.join(process.cwd(), ".next", "cache", "webpack");
const nextCliPath = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");

try {
  await rm(webpackCachePath, { force: true, recursive: true });
  console.log("Repaired Next.js development cache.");
} catch (error) {
  console.warn("Could not repair Next.js development cache:", error);
}

const child = spawn(process.execPath, [nextCliPath, "dev"], {
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
