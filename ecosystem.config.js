module.exports = {
  apps: [
    {
      name: "it-services-agency",
      script: ".next/standalone/server.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      time: true,
      max_memory_restart: "512M",
      exp_backoff_restart_delay: 100,
      kill_timeout: 5000,
    },
  ],
};
