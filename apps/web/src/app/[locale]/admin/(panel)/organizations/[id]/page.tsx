import { OrganizationCard } from "@/components/admin/sections/organizations";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <OrganizationCard id={id} />;
}
