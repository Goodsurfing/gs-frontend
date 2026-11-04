import { SiteCard } from "@/components/admin/sections/site";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <SiteCard kind="team" id={id} />;
}
