"use client";

import { pageItems } from "@/lib/pagination";

import { PAGE_ITEM } from "./Pagination";

const PREV = "M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z";
const NEXT = "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z";

/**
 * Пагинация кнопками — для списков кабинета, которые листаются без смены
 * адреса. Как MUI Pagination size="large" старого фронта: при count 0 —
 * только неактивные стрелки.
 */
export function PageButtons({ page, count, onChange, labels }: {
    page: number;
    count: number;
    onChange: (page: number) => void;
    labels: { prev: string; next: string; page: string };
}) {
    const arrow = (target: number, disabled: boolean, label: string, path: string) => (
        <button type="button" aria-label={label} disabled={disabled} onClick={() => onChange(target)} className={`${PAGE_ITEM} cursor-pointer transition-colors hover:bg-black/4 disabled:cursor-default disabled:opacity-38 disabled:hover:bg-transparent`}>
            <svg aria-hidden viewBox="0 0 24 24" className="-mx-2 h-[22px] w-[22px] fill-current"><path d={path} /></svg>
        </button>
    );
    return (
        <nav className="flex" aria-label={labels.page}>
            <ul className="flex flex-wrap items-center">
                <li>{arrow(page - 1, page <= 1, labels.prev, PREV)}</li>
                {count > 0 && pageItems(page, count).map((item) => (
                    <li key={item}>
                        {typeof item === "number"
                            ? (
                                <button
                                    type="button"
                                    aria-current={item === page ? "page" : undefined}
                                    onClick={() => onChange(item)}
                                    className={`${PAGE_ITEM} cursor-pointer transition-colors hover:bg-black/4 aria-[current=page]:bg-black/8`}
                                >
                                    {item}
                                </button>
                            )
                            : <span className={`${PAGE_ITEM} h-auto`}>…</span>}
                    </li>
                ))}
                <li>{arrow(page + 1, page >= count, labels.next, NEXT)}</li>
            </ul>
        </nav>
    );
}
