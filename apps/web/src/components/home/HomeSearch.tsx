"use client";

import { useEffect, useRef, useState } from "react";

import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";

interface Suggestion { id: number; title: string; status: string; image?: string; category?: string }

/**
 * Поиск на первом экране главной (InfoSearchOffers старого фронта): через
 * полсекунды после ввода — три подходящие вакансии и «Посмотреть все»;
 * «Найти» и Enter ведут в каталог с поиском.
 */
export function HomeSearch({ catalogHref, offerHref, categories, labels }: {
    catalogHref: string;
    /** Адрес вакансии с {id} */
    offerHref: string;
    categories: Record<string, string>;
    labels: { placeholder: string; search: string; find: string; clear: string; showAll: string; empty: string };
}) {
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<Suggestion[] | null>(null);
    const box = useRef<HTMLDivElement>(null);
    const query = value.trim();

    useEffect(() => {
        if (!query) return;
        let cancelled = false;
        const timer = setTimeout(() => {
            void browserApi()
                .GET("/api/v1/vacancy", { params: { query: { search: query, sort: "updated:desc", fields: "card", limit: 3 } } })
                .then(({ data }) => {
                    if (cancelled) return;
                    setItems((data?.data ?? []).slice(0, 3).map((offer) => ({
                        id: offer.id,
                        title: offer.title,
                        status: String(offer.status),
                        image: mediaUrl(offer.image, "small"),
                        category: offer.categories[0]?.name ? categories[offer.categories[0].name.trim()] ?? offer.categories[0].name : undefined,
                    })));
                })
                .catch(() => !cancelled && setItems([]));
        }, 500);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [query, categories]);

    useEffect(() => {
        const close = (event: MouseEvent) => {
            if (box.current && !box.current.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const submit = () => {
        setOpen(false);
        window.location.assign(query ? `${catalogHref}?search=${encodeURIComponent(query)}` : catalogHref);
    };

    return (
        <div ref={box} className="relative flex w-full items-center gap-5">
            <div className="flex w-full gap-1.5 rounded-[4px] border border-field bg-white px-1.5 py-[3px] transition-colors focus-within:border-primary">
                <input
                    value={value}
                    onChange={(event) => {
                        setValue(event.target.value);
                        setItems(null);
                        setOpen(true);
                    }}
                    onClick={() => setOpen(true)}
                    onKeyDown={(event) => event.key === "Enter" && submit()}
                    placeholder={labels.placeholder}
                    aria-label={labels.search}
                    className="h-10 w-full flex-1 bg-transparent px-3.5 py-[5px] font-[Roboto,Helvetica,Arial,sans-serif] text-[16px] text-black/87 outline-none placeholder:text-black/42"
                />
                {value && (
                    <button type="button" aria-label={labels.clear} onClick={() => setValue("")} className="cursor-pointer pr-2.5 text-[20px] text-caption">×</button>
                )}
            </div>
            <button
                type="button"
                onClick={submit}
                className="group flex cursor-pointer items-center gap-2 rounded-[10px] border border-primary bg-primary px-10 py-5 text-[16px] text-white transition-all duration-300 hover:bg-white hover:text-primary"
            >
                {labels.find}
                <svg aria-hidden width="16" height="16" viewBox="0 0 18 18" fill="none" className="stroke-white transition-all duration-300 group-hover:stroke-primary">
                    <path d="M11.2188 11.2192L16.9996 17.0001M7.1315 13.263C10.5178 13.263 13.263 10.5178 13.263 7.1315C13.263 3.74517 10.5178 1 7.1315 1C3.74517 1 1 3.74517 1 7.1315C1 10.5178 3.74517 13.263 7.1315 13.263Z" strokeWidth="2" />
                </svg>
            </button>
            {open && query && (
                <div className="absolute top-[120%] right-0 left-0 z-10 flex max-h-[300px] flex-col gap-2.5 overflow-x-hidden overflow-y-auto border border-field bg-white px-[15px] py-2">
                    {items === null ? <span className="py-2 text-center text-caption">…</span> : (
                        <>
                            {items.length > 0 ? items.map((offer) => (
                                <a key={offer.id} href={offerHref.replace("{id}", String(offer.id))} className={`flex gap-[15px] ${offer.status === "active" ? "" : "opacity-45"}`}>
                                    {/* eslint-disable-next-line @next/next/no-img-element -- превью из хранилища */}
                                    <img src={offer.image ?? "/web/images/home/default-offer.png"} alt={offer.title} className="h-[60px] w-20 object-cover" />
                                    <div className="min-w-0 overflow-hidden">
                                        <p className="truncate text-[14px]">{offer.title}</p>
                                        <p className="truncate text-[12px] text-primary">{offer.category}</p>
                                    </div>
                                </a>
                            )) : <span>{labels.empty}</span>}
                            <button type="button" onClick={submit} className="cursor-pointer rounded-[10px] border border-primary bg-primary px-[50px] py-2.5 text-[16px] text-white hover:bg-white hover:text-primary">
                                {labels.showAll}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
