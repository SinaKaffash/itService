import { AdminContentListPage } from "@/components/admin/content-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminServicesPage() {
  return <AdminContentListPage entity="service" />;
}
