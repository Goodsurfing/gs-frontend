import Link from "next/link";
import { Suspense } from "react";

import { type CommentKind, CommentsList } from "@/components/admin/sections/content";

const TABS: [CommentKind, string][] = [["news", "Новости"], ["blog", "Блог"], ["journal", "Журналы"], ["video", "Видео"]];

/** Комментарии к материалам — вкладки старой админки */
export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const { tab } = await searchParams;
    const kind = TABS.find(([k]) => k === tab)?.[0] ?? "news";
    return (
        <div>
            <nav aria-label="Комментарии к" className="mb-4 flex flex-wrap gap-1">
                {TABS.map(([k, label]) => (
                    <Link key={k} href={`/admin/reviews-community?tab=${k}`} aria-current={k === kind ? "page" : undefined} className={`rounded-[6px] px-3 py-1.5 ${k === kind ? "bg-primary text-white" : "bg-surface"}`}>{label}</Link>
                ))}
            </nav>
            <Suspense key={kind}><CommentsList kind={kind} /></Suspense>
        </div>
    );
}
