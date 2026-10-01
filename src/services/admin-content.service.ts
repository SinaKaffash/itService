import type {
  AdminContentRepository,
  ContentEntityType,
  SaveAdminContentData,
} from "@/core/admin-content";
import type { ValidatedAdminContent } from "@/features/admin/content.schema";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { generateSlug } from "@/lib/slug";
import { PrismaAdminContentRepository } from "@/repositories/prisma/admin-content.repository";

export class AdminContentService {
  constructor(private readonly repository: AdminContentRepository) {}

  list(entity: ContentEntityType) {
    return this.repository.list(entity);
  }

  get(entity: ContentEntityType, id: string) {
    return this.repository.findById(entity, id);
  }

  async create(input: ValidatedAdminContent) {
    const data = this.toData(input);
    if (await this.repository.findBySlug(data.entity, data.slug)) {
      throw new ConflictError("Content slug already exists.", {
        clientCode: "SLUG_EXISTS",
        context: { entity: data.entity, slug: data.slug },
      });
    }
    return this.repository.create(data);
  }

  async update(input: ValidatedAdminContent) {
    if (!input.id) {
      throw new NotFoundError("Content record ID is required.", {
        clientCode: "NOT_FOUND",
      });
    }
    const data = this.toData(input);
    const matchingSlug = await this.repository.findBySlug(
      data.entity,
      data.slug,
    );
    if (matchingSlug && matchingSlug.id !== input.id) {
      throw new ConflictError("Content slug already exists.", {
        clientCode: "SLUG_EXISTS",
        context: { entity: data.entity, slug: data.slug },
      });
    }
    if (!(await this.repository.update(input.id, data))) {
      throw new NotFoundError("Content record was not found.", {
        clientCode: "NOT_FOUND",
        context: { entity: data.entity, id: input.id },
      });
    }
  }

  async delete(entity: ContentEntityType, id: string) {
    if (!(await this.repository.delete(entity, id))) {
      throw new NotFoundError("Content record was not found.", {
        clientCode: "NOT_FOUND",
        context: { entity, id },
      });
    }
  }

  private toData(input: ValidatedAdminContent): SaveAdminContentData {
    const slug = generateSlug(input.slug || input.title);
    return {
      entity: input.entity,
      slug,
      title: input.title,
      description: input.description,
      category: input.category,
      content: input.content,
      icon: input.icon,
      coverImage: input.coverImage,
      gallery: input.gallery
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      technologies: input.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      sortOrder: input.sortOrder,
      published: input.published,
      isActive: input.isActive,
    };
  }
}

export const adminContentService = new AdminContentService(
  new PrismaAdminContentRepository(),
);
