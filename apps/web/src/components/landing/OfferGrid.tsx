"use client";

import { type ReactNode, useState } from "react";

/** Сколько карточек видно на телефоне до «Ещё» */
export const MOBILE_VISIBLE = 6;

/**
 * Сетка карточек вакансий посадочной страницы. На телефоне карточки идут в одну колонку,
 * по полэкрана каждая: 24 карточки — это 13 000 px прокрутки до частых вопросов и ссылок
 * на соседние страницы (24.11.2026). Поэтому на телефоне видны первые MOBILE_VISIBLE, дальше —
 * кнопка «Ещё N». Все карточки при этом остаются в разметке страницы (поисковик видит их все),
 * на компьютере и планшете ничего не скрывается.
 */
export function OfferGrid({ count, moreLabel, className = "", children }: {
    count: number;
    /** «Ещё {n} вакансий» */
    moreLabel: string;
    className?: string;
    children: ReactNode;
}) {
    const [expanded, setExpanded] = useState(false);
    const hidden = count - MOBILE_VISIBLE;
    const collapse = !expanded && hidden > 0;
    return (
        <>
            <ul className={`m-0 grid list-none grid-cols-3 gap-5 p-0 down-lg:grid-cols-2 down-sm:grid-cols-1 ${collapse ? "down-sm:[&>li:nth-child(n+7)]:hidden" : ""} ${className}`}>
                {children}
            </ul>
            {collapse && (
                <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="mt-5 hidden w-full cursor-pointer rounded-[10px] border border-primary px-5 py-3 text-[16px] text-primary transition-colors hover:bg-primary hover:text-white down-sm:block"
                >
                    {moreLabel.replace("{n}", String(hidden))}
                </button>
            )}
        </>
    );
}
