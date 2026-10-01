import { AdminContentEditorPage } from "@/components/admin/content-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NewPortfolioPage() {
  return <AdminContentEditorPage entity="portfolio" />;
}
