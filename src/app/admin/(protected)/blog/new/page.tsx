import { AdminContentEditorPage } from "@/components/admin/content-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NewBlogPostPage() {
  return <AdminContentEditorPage entity="blog" />;
}
