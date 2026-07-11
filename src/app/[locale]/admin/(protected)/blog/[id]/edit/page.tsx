import { AdminContentEditorPage } from "@/components/admin/content-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminContentEditorPage entity="blog" id={id} />;
}
