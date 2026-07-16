"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { saveAdminContentAction } from "@/actions/admin-content.actions";
import type {
  AdminContentRecord,
  ContentEntityType,
} from "@/core/admin-content";
import {
  adminContentSchema,
  type AdminContentFormValues,
} from "@/features/admin/content.schema";
import { useRouter } from "@/i18n/navigation";
import { generateSlug } from "@/lib/slug";

import { SubmissionError } from "@/components/forms/submission-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const routeNames: Record<ContentEntityType, string> = {
  service: "services",
  portfolio: "portfolio",
  blog: "blog",
};

export function ContentEditorForm({
  entity,
  record,
}: {
  entity: ContentEntityType;
  record?: AdminContentRecord;
}) {
  const locale = useLocale() as "fa" | "en";
  const router = useRouter();
  const t = useTranslations("AdminContent.form");
  const common = useTranslations("Common.errors");
  const [submitError, setSubmitError] = useState<{
    message: string;
    requestId?: string;
  } | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<AdminContentFormValues>({
    resolver: zodResolver(adminContentSchema),
    defaultValues: {
      entity,
      id: record?.id,
      slug: record?.slug ?? "",
      titleFa: record?.translations.fa.title ?? "",
      titleEn: record?.translations.en.title ?? "",
      descriptionFa: record?.translations.fa.description ?? "",
      descriptionEn: record?.translations.en.description ?? "",
      categoryFa: record?.translations.fa.category ?? "",
      categoryEn: record?.translations.en.category ?? "",
      contentFa: record?.translations.fa.content ?? "",
      contentEn: record?.translations.en.content ?? "",
      icon: record?.icon ?? "",
      coverImage: record?.coverImage ?? "",
      gallery: record?.gallery.join(", ") ?? "",
      technologies: record?.technologies.join(", ") ?? "",
      sortOrder: record?.sortOrder ?? 0,
      published: record?.published ?? false,
      isActive: record?.isActive ?? true,
    },
    mode: "onBlur",
  });

  const fieldError = (name: keyof typeof errors) =>
    errors[name] ? (
      <p className="text-xs text-destructive">
        {errors[name]?.message === "slug"
          ? t("validation.slug")
          : errors[name]?.message === "content"
            ? t("validation.content")
            : errors[name]?.message === "imageUrl"
              ? t("validation.imageUrl")
            : t("validation.required")}
      </p>
    ) : null;

  return (
    <form
      className="space-y-8"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        setSubmitError(null);
        const result = await saveAdminContentAction({ ...values, locale });
        if (result.success) {
          router.push(`/admin/${routeNames[entity]}`);
          router.refresh();
          return;
        }
        setSubmitError(
          {
            message:
              result.code === "SLUG_EXISTS"
                ? t("errors.slugExists")
                : result.code === "UNAUTHORIZED"
                  ? t("errors.unauthorized")
                  : t("errors.generic"),
            requestId: result.requestId,
          },
        );
      })}
    >
      <input type="hidden" {...register("entity")} />
      <input type="hidden" {...register("id")} />

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-bold">{t("identityTitle")}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="content-title-en">{t("titleEn")}</Label>
            <Input
              dir="ltr"
              id="content-title-en"
              {...register("titleEn", {
                onBlur: () => {
                  if (!watch("slug")) {
                    setValue("slug", generateSlug(watch("titleEn")), {
                      shouldValidate: true,
                    });
                  }
                },
              })}
            />
            {fieldError("titleEn")}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content-title-fa">{t("titleFa")}</Label>
            <Input id="content-title-fa" {...register("titleFa")} />
            {fieldError("titleFa")}
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <Label htmlFor="content-slug">{t("slug")}</Label>
          <Input dir="ltr" id="content-slug" {...register("slug")} />
          <p className="text-xs text-muted-foreground">{t("slugHint")}</p>
          {fieldError("slug")}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-bold">{t("localizedTitle")}</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="content-description-en">
              {t("descriptionEn")}
            </Label>
            <Textarea
              className="min-h-32"
              dir="ltr"
              id="content-description-en"
              {...register("descriptionEn")}
            />
            {fieldError("descriptionEn")}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content-description-fa">
              {t("descriptionFa")}
            </Label>
            <Textarea
              className="min-h-32"
              id="content-description-fa"
              {...register("descriptionFa")}
            />
            {fieldError("descriptionFa")}
          </div>
        </div>

        {entity === "portfolio" ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="content-category-en">{t("categoryEn")}</Label>
              <Input
                dir="ltr"
                id="content-category-en"
                {...register("categoryEn")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-category-fa">{t("categoryFa")}</Label>
              <Input
                id="content-category-fa"
                {...register("categoryFa")}
              />
              {fieldError("categoryFa")}
            </div>
          </div>
        ) : null}

        {entity === "blog" ? (
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="content-body-en">{t("contentEn")}</Label>
              <Textarea
                className="min-h-64"
                dir="ltr"
                id="content-body-en"
                {...register("contentEn")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-body-fa">{t("contentFa")}</Label>
              <Textarea
                className="min-h-64"
                id="content-body-fa"
                {...register("contentFa")}
              />
              {fieldError("contentFa")}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-bold">{t("settingsTitle")}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {entity === "service" ? (
            <div className="space-y-2">
              <Label htmlFor="content-icon">{t("icon")}</Label>
              <Input dir="ltr" id="content-icon" {...register("icon")} />
            </div>
          ) : null}
          {entity === "portfolio" ? (
            <div className="space-y-2">
              <Label htmlFor="content-technologies">
                {t("technologies")}
              </Label>
              <Input
                dir="ltr"
                id="content-technologies"
                {...register("technologies")}
              />
              <p className="text-xs text-muted-foreground">
                {t("technologiesHint")}
              </p>
            </div>
          ) : null}
          {entity !== "service" ? (
            <div className="space-y-2">
              <Label htmlFor="content-cover-image">{t("coverImage")}</Label>
              <Input
                dir="ltr"
                id="content-cover-image"
                placeholder="/images/marketing/workspace-dashboard.svg"
                {...register("coverImage")}
              />
              <p className="text-xs text-muted-foreground">
                {t("coverImageHint")}
              </p>
              {fieldError("coverImage")}
            </div>
          ) : null}
          {entity === "portfolio" ? (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="content-gallery">{t("gallery")}</Label>
              <Input
                dir="ltr"
                id="content-gallery"
                placeholder="/images/marketing/workspace-dashboard.svg, /images/marketing/cloud-operations.svg"
                {...register("gallery")}
              />
              <p className="text-xs text-muted-foreground">
                {t("galleryHint")}
              </p>
              {fieldError("gallery")}
            </div>
          ) : null}
          {entity !== "blog" ? (
            <div className="space-y-2">
              <Label htmlFor="content-order">{t("sortOrder")}</Label>
              <Input
                id="content-order"
                min={0}
                type="number"
                {...register("sortOrder")}
              />
            </div>
          ) : null}
        </div>
        <div className="mt-6 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              className="size-4 accent-primary"
              type="checkbox"
              {...register("published")}
            />
            {t("published")}
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              className="size-4 accent-primary"
              type="checkbox"
              {...register("isActive")}
            />
            {t("isActive")}
          </label>
        </div>
      </div>

      {submitError ? (
        <SubmissionError
          message={submitError.message}
          referenceLabel={common("reference")}
          requestId={submitError.requestId}
        />
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={isSubmitting} size="lg" type="submit">
          {isSubmitting ? (
            <Loader2 aria-hidden="true" className="animate-spin" />
          ) : null}
          {record ? t("saveChanges") : t("create")}
        </Button>
        <Button
          disabled={isSubmitting}
          onClick={() => router.back()}
          size="lg"
          type="button"
          variant="outline"
        >
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
