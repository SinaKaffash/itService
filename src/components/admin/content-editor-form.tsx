"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { saveAdminContentAction } from "@/actions/admin-content.actions";
import type { AdminContentRecord, ContentEntityType } from "@/core/admin-content";
import { adminContentSchema, type AdminContentFormValues } from "@/features/admin/content.schema";
import { generateSlug } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
const routes: Record<ContentEntityType, string> = { service: "services", portfolio: "portfolio", blog: "blog" };
export function ContentEditorForm({ entity, record }: { entity: ContentEntityType; record?: AdminContentRecord }) {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<AdminContentFormValues>({ resolver: zodResolver(adminContentSchema), defaultValues: { entity, id: record?.id, slug: record?.slug ?? "", title: record?.title ?? "", description: record?.description ?? "", category: record?.category ?? "", content: record?.content ?? "", icon: record?.icon ?? "", coverImage: record?.coverImage ?? "", gallery: record?.gallery.join(", ") ?? "", technologies: record?.technologies.join(", ") ?? "", sortOrder: record?.sortOrder ?? 0, published: record?.published ?? false, isActive: record?.isActive ?? true } });
  return <form className="space-y-6" onSubmit={handleSubmit(async values => { const result = await saveAdminContentAction(values); if (result.success) { router.push(`/admin/${routes[entity]}`); router.refresh(); } })}>
    <input type="hidden" {...register("entity")} /><input type="hidden" {...register("id")} />
    <section className="space-y-4 rounded-xl border bg-white p-6"><h2 className="text-lg font-bold">محتوای فارسی</h2>
      <Field label="عنوان"><Input {...register("title", { onBlur: () => !watch("slug") && setValue("slug", generateSlug(watch("title"))) })} /></Field>
      <Field label="نامک"><Input dir="ltr" {...register("slug")} /></Field><Field label="توضیح"><Textarea {...register("description")} /></Field>
      {entity === "portfolio" && <Field label="دسته‌بندی"><Input {...register("category")} /></Field>}{entity === "blog" && <Field label="متن"><Textarea className="min-h-64" {...register("content")} /></Field>}
    </section><section className="space-y-4 rounded-xl border bg-white p-6"><h2 className="text-lg font-bold">تنظیمات</h2>
      {entity === "service" && <Field label="آیکون"><Input dir="ltr" {...register("icon")} /></Field>}{entity !== "service" && <Field label="تصویر اصلی"><Input dir="ltr" {...register("coverImage")} /></Field>}
      {entity === "portfolio" && <><Field label="گالری"><Input dir="ltr" {...register("gallery")} /></Field><Field label="فناوری‌ها"><Input dir="ltr" {...register("technologies")} /></Field></>}
      {entity !== "blog" && <Field label="ترتیب"><Input type="number" {...register("sortOrder")} /></Field>}<label><input type="checkbox" {...register("published")} /> انتشار</label><label className="ms-4"><input type="checkbox" {...register("isActive")} /> فعال</label>
    </section><Button disabled={isSubmitting} type="submit">{isSubmitting ? "در حال ذخیره…" : "ذخیره"}</Button></form>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div>; }
