import { OperationsEditorPage } from "@/components/admin/operations-pages";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <OperationsEditorPage entity="announcement" id={(await params).id} />; }
