"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { listHref, type ListParams } from "@/lib/listParams";

// Старый фронт искал на каждое нажатие клавиши; здесь — после паузы в наборе
const DEBOUNCE_MS = 400;

/**
 * Поиск по списку: обновляет ?search= в адресе (страница — на первую, прочие
 * параметры сохраняются). Без JS — обычная GET-форма. Внешне — как
 * SearchInput (MUI Paper + InputBase) старого фронта.
 */
export function SearchField({ basePath, params, placeholder, label, className = "" }: {
    basePath: string;
    /** Текущие параметры списка: поиск меняется, остальные сохраняются, страница — первая */
    params: ListParams;
    placeholder: string;
    label: string;
    className?: string;
}) {
    const value = params.search;
    // Для формы без JS: параметры, которые нужно сохранить при поиске
    const hidden: Record<string, string | undefined> = {
        sort: params.sort === "new" ? undefined : params.sort,
        category: params.category?.toString(),
    };
    const router = useRouter();
    const [text, setText] = useState(value);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const apply = (next: string) => {
        clearTimeout(timer.current);
        router.replace(listHref(basePath, { ...params, page: 1, search: next.trim() }), { scroll: false });
    };

    return (
        <form
            role="search"
            onSubmit={(event) => { event.preventDefault(); apply(text); }}
            className={`box-border flex w-full max-w-[370px] items-center rounded-[10px] border border-caption bg-white px-1.5 py-1 ${className}`}
        >
            {Object.entries(hidden).map(([name, val]) => (val ? <input key={name} type="hidden" name={name} value={val} /> : null))}
            <input
                type="search"
                name="search"
                aria-label={label}
                placeholder={placeholder}
                value={text}
                onChange={(event) => {
                    const next = event.target.value;
                    setText(next);
                    clearTimeout(timer.current);
                    timer.current = setTimeout(() => apply(next), DEBOUNCE_MS);
                }}
                className="ml-2 box-content h-[23px] min-w-0 flex-1 bg-transparent pt-1 pb-[5px] font-[Roboto,Helvetica,Arial,sans-serif] text-[16px] leading-[23px] text-black/87 outline-none placeholder:text-black/42 [&::-webkit-search-cancel-button]:hidden"
            />
            <button type="submit" aria-label={label} className="mr-2 flex h-5 w-5 cursor-pointer items-center justify-center p-0 text-black/54">
                <svg aria-hidden width="18" height="18" viewBox="0 0 18 18" fill="transparent" className="block stroke-caption">
                    <path d="M11.2188 11.2192L16.9996 17.0001M7.1315 13.263C10.5178 13.263 13.263 10.5178 13.263 7.1315C13.263 3.74517 10.5178 1 7.1315 1C3.74517 1 1 3.74517 1 7.1315C1 10.5178 3.74517 13.263 7.1315 13.263Z" strokeWidth="2" />
                </svg>
            </button>
        </form>
    );
}
