"use client";

import { usePathname } from "next/navigation";

import { reportLink } from "@/lib/testBanner";

/**
 * Надпись «Тестовая версия» внутри ленты соцсетей (только стейдж): напоминание про тестовую
 * карту и «Сообщить о проблеме». Встаёт на место соцсетей, а не отдельной полосой — так высота
 * над шапкой та же, что на проде, и не съезжают экраны, рассчитанные от неё (каталог с картой,
 * сообщения, прилипающие меню разделов).
 */
export function TestRibbonNote({ bot }: { bot: string }) {
    const pathname = usePathname() ?? "/";
    return (
        <>
            <span className="text-center text-[15px] leading-[1.3] text-white down-sm:text-[14px]">
                🧪 <b>Тестовая версия</b>
                <span className="down-md:hidden"> · платите только тестовой картой 5555 5555 5555 4444</span>
            </span>
            <a
                href={reportLink(bot, pathname)}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-[15px] font-semibold whitespace-nowrap text-white underline down-sm:text-[14px]"
            >
                Сообщить о проблеме
            </a>
        </>
    );
}
