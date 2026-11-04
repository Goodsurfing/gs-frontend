import { AcademyCard } from "@/components/admin/sections/academy";

export default async function Page({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
    const { id, lessonId } = await params;
    return <AcademyCard kind="lesson" id={lessonId} courseId={id} />;
}
