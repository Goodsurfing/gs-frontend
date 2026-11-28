"use client";

import { usePathname } from "next/navigation";

import { reportLink, TEST_CARD } from "@/lib/testBanner";

/**
 * Надпись «Тестовая версия» внутри ленты соцсетей (только стейдж): напоминание про тестовую
 * карту «Мир» (и на телефоне — коротко) и «Сообщить о проблеме». Встаёт на место соцсетей, а не отдельной полосой — так высота
 * над шапкой та же, что на проде, и не съезжают экраны, рассчитанные от неё (каталог с картой,
 * сообщения, прилипающие меню разделов).
 */
export function TestRibbonNote({ bot }: { bot: string }) {
    const pathname = usePathname() ?? "/";
    return (
        <>
            <span className="text-center text-[15px] leading-[1.3] text-white down-sm:text-[13px]">
                🧪 <b className="down-md:hidden">Тестовая версия</b>
                <b className="hidden down-md:inline">Тест</b>
                {/* Полный текст — на широком экране; уже — короче, чтобы лента оставалась в одну строку */}
                <span className="down-xl:hidden"> · платите только тестовой картой «Мир» {TEST_CARD} и подтвердите оплату на тестовой странице 3-D Secure</span>
                <span className="hidden down-xl:inline down-md:hidden"> · тестовая карта «Мир» {TEST_CARD}</span>
                <span className="hidden whitespace-nowrap down-md:inline"> · Мир {TEST_CARD}</span>
            </span>
            <a
                href={reportLink(bot, pathname)}
                target="_blank"
                rel="noreferrer"
                aria-label="Сообщить о проблеме"
                className="shrink-0 text-[15px] font-semibold whitespace-nowrap text-white underline down-sm:text-[13px]"
            >
                {/* На телефоне коротко — чтобы полоса с картой оставалась в одну строку (44 px, как на проде) */}
                <span className="down-md:hidden">Сообщить о проблеме</span>
                <span className="hidden down-md:inline">Сообщить</span>
            </a>
        </>
    );
}
