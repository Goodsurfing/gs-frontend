import Link from "next/link";
import { Suspense } from "react";

import { ReviewsLists } from "@/components/admin/sections/reviews";

/** Отзывы: о вакансиях и о волонтёрах (у каждого списка своя пагинация — отдельные страницы по ?tab) */
export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const { tab } = await searchParams;
    const kind = tab === "volunteer" ? "volunteer" : "vacancy";
    return (
        <div>
            <nav aria-label="Вид отзывов" className="mb-4 flex gap-1">
                <Link href="/admin/reviews" aria-current={kind === "vacancy" ? "page" : undefined} className={`rounded-[6px] px-3 py-1.5 ${kind === "vacancy" ? "bg-primary text-white" : "bg-surface"}`}>О вакансиях</Link>
                <Link href="/admin/reviews?tab=volunteer" aria-current={kind === "volunteer" ? "page" : undefined} className={`rounded-[6px] px-3 py-1.5 ${kind === "volunteer" ? "bg-primary text-white" : "bg-surface"}`}>О волонтёрах</Link>
            </nav>
            <Suspense key={kind}><ReviewsLists kind={kind} /></Suspense>
        </div>
    );
}
