export const contentEntityTypes = ["service", "portfolio", "blog"] as const;
export type ContentEntityType = (typeof contentEntityTypes)[number];

export type LocalizedContentValue = {
  title: string;
  description: string;
  category?: string;
  content?: string;
};

export type AdminContentRecord = {
  id: string;
  entity: ContentEntityType;
  slug: string;
  translations: {
    fa: LocalizedContentValue;
    en: LocalizedContentValue;
  };
  published: boolean;
  isActive: boolean;
  sortOrder: number;
  icon: string;
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type SaveAdminContentData = Omit<
  AdminContentRecord,
  "id" | "createdAt" | "updatedAt"
>;

export interface AdminContentRepository {
  list(entity: ContentEntityType): Promise<readonly AdminContentRecord[]>;
  findById(
    entity: ContentEntityType,
    id: string,
  ): Promise<AdminContentRecord | null>;
  findBySlug(
    entity: ContentEntityType,
    slug: string,
  ): Promise<AdminContentRecord | null>;
  create(data: SaveAdminContentData): Promise<{ id: string }>;
  update(
    id: string,
    data: SaveAdminContentData,
  ): Promise<boolean>;
  delete(entity: ContentEntityType, id: string): Promise<boolean>;
}
