import { DictionaryCard } from "@/components/admin/sections/dictionaries";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <DictionaryCard kind="blogCategory" id={id} />;
}
