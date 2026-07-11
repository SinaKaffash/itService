import { AdminContentEditorPage } from "@/components/admin/content-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NewServicePage() {
  return <AdminContentEditorPage entity="service" />;
}
