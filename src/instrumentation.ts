export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateServerStartupEnv } = await import("@/lib/env.server");
    validateServerStartupEnv();
  }
}
