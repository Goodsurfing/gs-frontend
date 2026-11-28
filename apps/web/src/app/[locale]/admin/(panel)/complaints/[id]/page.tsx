import { ComplaintCard } from "@/components/admin/sections/complaints";

export default async function AdminComplaintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ComplaintCard id={decodeURIComponent(id)} />;
}
