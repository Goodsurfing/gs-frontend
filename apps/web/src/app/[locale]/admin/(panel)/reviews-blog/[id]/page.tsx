import { CommentCard } from "@/components/admin/sections/content";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CommentCard kind="blog" id={id} />;
}
