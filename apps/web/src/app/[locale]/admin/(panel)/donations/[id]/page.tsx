import { FundraiseEditor } from "@/components/admin/sections/fundraises";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <FundraiseEditor id={id} />;
}
