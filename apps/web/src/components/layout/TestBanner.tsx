"use client";

import { usePathname } from "next/navigation";

import { reportLink, TEST_BOT } from "@/lib/testBanner";

/** Полоса тестовой версии (только стейдж): напоминание про тестовую карту и кнопка «Сообщить о проблеме». */
export function TestBanner() {
    const pathname = usePathname() ?? "/";
    if (!TEST_BOT) return null;
    return (
        <div role="note" className="flex items-center justify-center gap-3 bg-[#fff4d6] px-4 py-1.5 text-[13px] leading-[1.3] text-ink-secondary">
            <span>
                🧪 <b>Тестовая версия</b>
                <span className="down-sm:hidden"> · платите только тестовой картой 5555 5555 5555 4444</span>
            </span>
            <a href={reportLink(TEST_BOT, pathname)} target="_blank" rel="noreferrer" className="shrink-0 font-semibold whitespace-nowrap text-primary underline">
                Сообщить о проблеме
            </a>
        </div>
    );
}
