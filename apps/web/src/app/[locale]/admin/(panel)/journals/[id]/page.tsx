import { ContentCard } from "@/components/admin/sections/content";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ContentCard kind="journal" id={id} />;
}
