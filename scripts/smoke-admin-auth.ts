import { readFileSync } from "node:fs";

import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

function loadLocalEnv() {
  const env = readFileSync(".env", "utf8");

  for (const line of env.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=["']?(.*?)["']?$/);

    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  }
}

async function main() {
  loadLocalEnv();

  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !email || !password) {
    throw new Error("ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD are required.");
  }

  const prisma = new PrismaClient();

  try {
    const admin = await prisma.adminUser.findFirst({
      where: {
        isActive: true,
        OR: [{ username }, { email }],
      },
      select: {
        email: true,
        passwordHash: true,
        username: true,
      },
    });

    if (!admin) {
      throw new Error("No active admin user matches ADMIN_USERNAME or ADMIN_EMAIL.");
    }

    const passwordMatches = await compare(password, admin.passwordHash);

    if (!passwordMatches) {
      throw new Error("ADMIN_PASSWORD does not match the stored admin password hash.");
    }

    console.log(
      `Admin credentials verified for ${admin.username} (${admin.email}).`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
