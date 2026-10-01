import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

const seedEnvSchema = z.object({
  ADMIN_EMAIL: z
    .string()
    .trim()
    .toLowerCase()
    .email("ADMIN_EMAIL must be a valid email address."),
  ADMIN_NAME: z
    .string()
    .trim()
    .min(2, "ADMIN_NAME must be at least 2 characters."),
  ADMIN_PASSWORD: z
    .string()
    .min(12, "ADMIN_PASSWORD must contain at least 12 characters."),
  ADMIN_USERNAME: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9._-]{3,32}$/,
      "ADMIN_USERNAME must be 3-32 lowercase letters, numbers, dots, underscores, or hyphens.",
    ),
});

function getSeedEnv() {
  const parsed = seedEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => {
        const field = issue.path.join(".") || "environment";
        return `- ${field}: ${issue.message}`;
      })
      .join("\n");

    throw new Error(`Seed environment configuration is invalid:\n${issues}`);
  }

  return parsed.data;
}

const services = [
  {
    slug: "web-platforms",
    icon: "globe",
    sortOrder: 1,
    translations: {
      en: {
        title: "Web platforms",
        description:
          "High-performance websites, commerce experiences, and business platforms built for growth.",
      },
      fa: {
        title: "پلتفرم‌های وب",
        description:
          "وب‌سایت‌های سریع، تجربه‌های تجارت الکترونیک و پلتفرم‌های کسب‌وکار برای رشد.",
      },
    },
  },
  {
    slug: "mobile-applications",
    icon: "mobile",
    sortOrder: 2,
    translations: {
      en: {
        title: "Mobile applications",
        description:
          "Purposeful iOS and Android products shaped around real workflows.",
      },
      fa: {
        title: "اپلیکیشن موبایل",
        description:
          "محصولات هدفمند iOS و اندروید متناسب با فرایندهای واقعی.",
      },
    },
  },
  {
    slug: "it-infrastructure",
    icon: "server",
    sortOrder: 3,
    translations: {
      en: {
        title: "IT infrastructure",
        description:
          "Cloud, security, and operational systems engineered for confidence.",
      },
      fa: {
        title: "زیرساخت IT",
        description:
          "ابر، امنیت و سامانه‌های عملیاتی مهندسی‌شده برای اطمینان.",
      },
    },
  },
  {
    slug: "custom-dashboards",
    icon: "dashboard",
    sortOrder: 4,
    translations: {
      en: {
        title: "Custom dashboards",
        description:
          "Focused internal tools that turn fragmented data into better decisions.",
      },
      fa: {
        title: "داشبوردهای اختصاصی",
        description:
          "ابزارهای داخلی متمرکز برای تبدیل داده پراکنده به تصمیم بهتر.",
      },
    },
  },
];

const portfolio = [
  {
    slug: "aura-fintech",
    coverImage: "/images/marketing/workspace-dashboard.svg",
    gallery: [
      "/images/marketing/web-platform.svg",
      "/images/marketing/cloud-operations.svg",
      "/images/marketing/mobile-product.svg",
    ],
    technologies: ["Next.js", "Node.js", "PostgreSQL"],
    sortOrder: 1,
    translations: {
      en: {
        title: "Aura Fintech",
        category: "Financial technology",
        description: "A real-time asset operations platform for finance teams.",
      },
      fa: {
        title: "آورا فین‌تک",
        category: "فناوری مالی",
        description: "پلتفرم بلادرنگ عملیات دارایی برای تیم‌های مالی.",
      },
    },
  },
  {
    slug: "vertex-cloud",
    coverImage: "/images/marketing/cloud-operations.svg",
    gallery: [
      "/images/marketing/cloud-operations.svg",
      "/images/marketing/workspace-dashboard.svg",
      "/images/marketing/web-platform.svg",
    ],
    technologies: ["Kubernetes", "AWS", "Terraform"],
    sortOrder: 2,
    translations: {
      en: {
        title: "Vertex Cloud",
        category: "Cloud infrastructure",
        description: "A secure cloud modernization and observability program.",
      },
      fa: {
        title: "ورتکس کلاد",
        category: "زیرساخت ابری",
        description: "برنامه نوسازی امن ابر و پایش‌پذیری.",
      },
    },
  },
  {
    slug: "astral-mobile",
    coverImage: "/images/marketing/mobile-product.svg",
    gallery: [
      "/images/marketing/mobile-product.svg",
      "/images/marketing/team-studio.svg",
      "/images/marketing/workspace-dashboard.svg",
    ],
    technologies: ["React Native", "TypeScript", "GraphQL"],
    sortOrder: 3,
    translations: {
      en: {
        title: "Astral Mobile",
        category: "Mobile product",
        description: "An offline-first field operations application.",
      },
      fa: {
        title: "استرال موبایل",
        category: "محصول موبایل",
        description: "اپلیکیشن آفلاین‌محور عملیات میدانی.",
      },
    },
  },
];

const blogPosts = [
  {
    slug: "scalable-modular-architecture",
    coverImage: "/images/marketing/web-platform.svg",
    publishedAt: new Date("2026-06-18T09:00:00.000Z"),
    translations: {
      en: {
        title: "How modular architecture preserves your options",
        excerpt: "Designing boundaries that support today without trapping tomorrow.",
        content: "Good architecture preserves the ability to respond to change.",
      },
      fa: {
        title: "چگونه معماری ماژولار انتخاب‌های شما را حفظ می‌کند",
        excerpt: "طراحی مرزهایی که امروز را پشتیبانی می‌کند و فردا را به دام نمی‌اندازد.",
        content: "معماری خوب توان پاسخ‌گویی به تغییر را حفظ می‌کند.",
      },
    },
  },
  {
    slug: "web-performance-that-converts",
    coverImage: "/images/marketing/workspace-dashboard.svg",
    publishedAt: new Date("2026-05-27T09:00:00.000Z"),
    translations: {
      en: {
        title: "Web performance that improves conversion",
        excerpt: "Why speed is both a product and revenue concern.",
        content: "Users experience performance as confidence.",
      },
      fa: {
        title: "عملکرد وب که تبدیل را بهتر می‌کند",
        excerpt: "چرا سرعت هم موضوع محصول است و هم درآمد.",
        content: "کاربران عملکرد را به شکل اطمینان تجربه می‌کنند.",
      },
    },
  },
  {
    slug: "security-by-design",
    coverImage: "/images/marketing/cloud-operations.svg",
    publishedAt: new Date("2026-05-04T09:00:00.000Z"),
    translations: {
      en: {
        title: "Security by design for growing platforms",
        excerpt: "A practical approach to identity, visibility, and recovery.",
        content: "Security works best as an everyday design constraint.",
      },
      fa: {
        title: "امنیت از پایه برای پلتفرم‌های در حال رشد",
        excerpt: "رویکردی عملی به هویت، دید عملیاتی و بازیابی.",
        content: "امنیت به‌عنوان محدودیت روزمره طراحی بهترین نتیجه را می‌دهد.",
      },
    },
  },
];

for (const item of services) {
  Object.assign(item, item.translations.fa);
  item.content = item.content ?? "";
  delete item.translations;
}

for (const item of portfolio) {
  Object.assign(item, item.translations.fa);
  item.content = item.content ?? "";
  delete item.translations;
}

for (const item of blogPosts) {
  Object.assign(item, item.translations.fa);
  item.description = item.description ?? item.excerpt ?? "";
  item.category = item.category ?? "";
  delete item.excerpt;
  delete item.translations;
}

async function main() {
  const {
    ADMIN_EMAIL: adminEmail,
    ADMIN_NAME: adminName,
    ADMIN_PASSWORD: adminPassword,
    ADMIN_USERNAME: adminUsername,
  } = getSeedEnv();

  const passwordHash = await hash(adminPassword, 12);

  const existingAdmin = await prisma.adminUser.findFirst({
    where: { role: "SUPER_ADMIN" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  const admin = existingAdmin
    ? await prisma.adminUser.update({
        where: { id: existingAdmin.id },
        data: {
          email: adminEmail,
          username: adminUsername,
          name: adminName,
          passwordHash,
          isActive: true,
        },
      })
    : await prisma.adminUser.create({
        data: {
          email: adminEmail,
          username: adminUsername,
          name: adminName,
          passwordHash,
          role: "SUPER_ADMIN",
          isActive: true,
        },
      });

  await prisma.adminSession.deleteMany({
    where: { userId: admin.id },
  });

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: { ...service, published: true, isActive: true },
      create: { ...service, published: true, isActive: true },
    });
  }

  for (const item of portfolio) {
    await prisma.portfolio.upsert({
      where: { slug: item.slug },
      update: { ...item, published: true, isActive: true },
      create: { ...item, published: true, isActive: true },
    });
  }

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { ...post, published: true, isActive: true },
      create: { ...post, published: true, isActive: true },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
