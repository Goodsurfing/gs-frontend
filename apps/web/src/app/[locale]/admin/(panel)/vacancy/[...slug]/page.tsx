import { notFound } from "next/navigation";

import { VacancyEditor } from "@/components/admin/sections/vacancies";

/** /admin/vacancy/:id и старые адреса шагов /admin/vacancy/{where,when,…}/:id — одна страница правки */
export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const id = slug.at(-1);
    if (!id || !/^\d+$/.test(id)) notFound();
    return <VacancyEditor id={id} />;
}
