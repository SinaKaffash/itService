import { spawn } from "node:child_process";
import { stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const nextCliPath = path.join(root, "node_modules", "next", "dist", "bin", "next");
const copyStandaloneAssetsPath = path.join(
  root,
  "scripts",
  "copy-standalone-assets.mjs",
);
const standaloneServerPath = path.join(root, ".next", "standalone", "server.js");

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

function run(command, args, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env,
      shell: false,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      resolve(code ?? 0);
    });
  });
}

if (!(await exists(standaloneServerPath))) {
  console.log("Standalone server was not found. Building production bundle...");

  const buildCode = await run(process.execPath, [nextCliPath, "build"], {
    ...process.env,
    NODE_ENV: "production",
  });

  if (buildCode !== 0) {
    process.exit(buildCode);
  }

  const copyCode = await run(process.execPath, [copyStandaloneAssetsPath], {
    ...process.env,
    NODE_ENV: "production",
  });

  if (copyCode !== 0) {
    process.exit(copyCode);
  }
}

if (!(await exists(standaloneServerPath))) {
  console.error(
    "Production start failed: .next/standalone/server.js was not created. Check next.config.js output and the build logs.",
  );
  process.exit(1);
}

const server = spawn(process.execPath, [standaloneServerPath], {
  env: {
    ...process.env,
    HOSTNAME: process.env.HOSTNAME ?? "127.0.0.1",
    NODE_ENV: "production",
    PORT: process.env.PORT ?? "3000",
  },
  stdio: "inherit",
});

server.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
