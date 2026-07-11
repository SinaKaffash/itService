import { adminContentSchema } from "../src/features/admin/content.schema";
import { prisma } from "../src/lib/prisma";
import { adminContentService } from "../src/services/admin-content.service";

const marker = Date.now().toString();

async function main() {
  for (const entity of ["service", "portfolio", "blog"] as const) {
    const input = adminContentSchema.parse({
      entity,
      slug: `smoke-${entity}-${marker}`,
      titleFa: `آزمایش ${entity}`,
      titleEn: `Smoke ${entity}`,
      descriptionFa: "توضیح آزمایشی معتبر برای بررسی مدیریت محتوا.",
      descriptionEn: "A valid smoke-test description for content management.",
      categoryFa: entity === "portfolio" ? "آزمایشی" : "",
      categoryEn: entity === "portfolio" ? "Test" : "",
      contentFa:
        entity === "blog"
          ? "این متن آزمایشی طول کافی برای اعتبارسنجی محتوای مقاله را دارد."
          : "",
      contentEn:
        entity === "blog"
          ? "This smoke-test article body is long enough for validation."
          : "",
      icon: entity === "service" ? "globe" : "",
      technologies: entity === "portfolio" ? "Next.js, PostgreSQL" : "",
      sortOrder: 9999,
      published: false,
      isActive: true,
    });

    const created = await adminContentService.create(input);
    const saved = await adminContentService.get(entity, created.id);
    if (!saved || saved.slug !== input.slug) {
      throw new Error(`Failed to create ${entity} content.`);
    }

    await adminContentService.update({
      ...input,
      id: created.id,
      published: true,
    });
    const updated = await adminContentService.get(entity, created.id);
    if (!updated?.published) {
      throw new Error(`Failed to update ${entity} content.`);
    }

    await adminContentService.delete(entity, created.id);
    if (await adminContentService.get(entity, created.id)) {
      throw new Error(`Failed to delete ${entity} content.`);
    }
  }

  console.log("Admin content CRUD smoke test passed.");
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
