const createNextIntlPlugin = require("next-intl/plugin");
const os = require("node:os");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

function getLocalDevOrigins() {
  const origins = new Set(["192.168.43.16"]);

  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const network of interfaces ?? []) {
      if (network.family === "IPv4" && !network.internal) {
        origins.add(network.address);
      }
    }
  }

  for (const origin of process.env.ALLOWED_DEV_ORIGINS?.split(",") ?? []) {
    const value = origin.trim();
    if (!value) {
      continue;
    }

    try {
      origins.add(new URL(value).hostname);
    } catch {
      origins.add(value.replace(/^https?:\/\//, "").replace(/:\d+$/, ""));
    }
  }

  return [...origins];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: getLocalDevOrigins(),
  compress: true,
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon.svg",
        permanent: true,
      },
    ];
  },
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    return [
      {
        source:
          "/:path*.:ext(js|css|woff|woff2|ttf|otf|png|jpg|jpeg|gif|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
