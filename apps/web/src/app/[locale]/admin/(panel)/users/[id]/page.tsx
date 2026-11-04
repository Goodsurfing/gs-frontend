import { UserCard } from "@/components/admin/sections/UserCard";

export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <UserCard id={decodeURIComponent(id)} />;
}
