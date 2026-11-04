import { ReviewCard } from "@/components/admin/sections/reviews";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ReviewCard kind="volunteer" id={id} />;
}
