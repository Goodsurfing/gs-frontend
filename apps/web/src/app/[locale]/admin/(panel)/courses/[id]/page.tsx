import { AcademyCard } from "@/components/admin/sections/academy";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AcademyCard kind="course" id={id} />;
}
