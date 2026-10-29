"use client";

import { useMemo, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";

export interface RatingRow { id: string; name: string; count: number; total: number }

export interface RatingLabels {
    sortLabel: string;
    byCount: string;
    byTotal: string;
    desc: string;
    asc: string;
    search: string;
    name: string;
    count: string;
    total: string;
    empty: string;
}

const SORT_DOWN = "M7.5 25L12.5 20H8.75V5H6.25V20H2.5L7.5 25ZM13.75 10H25V12.5H13.75V10ZM13.75 15H22.5V17.5H13.75V15ZM13.75 5H27.5V7.5H13.75V5ZM13.75 20H20V22.5H13.75V20Z";
const SORT_UP = "M13.75 11.25H25V13.75H13.75V11.25ZM13.75 16.25H22.5V18.75H13.75V16.25ZM13.75 6.25H27.5V8.75H13.75V6.25ZM13.75 21.25H20V23.75H13.75V21.25ZM6.25 25H8.75V10H12.5L7.5 5L2.5 10H6.25V25Z";

const cell = "h-[52px] border-b border-[#e0e0e0] px-2.5 text-left text-[0.875rem]";
const head = "h-14 border-b border-[#e0e0e0] bg-field px-2.5 text-left text-[0.875rem] font-bold";

/**
 * Рейтинг жертвователей (DonationRating старого фронта): сто первых с
 * сервера, сортировка по числу или сумме, поиск по имени — в браузере.
 * Вошедшим видны id и ссылки на профили; страница общая, поэтому это
 * дорисовывается после проверки входа.
 */
export function DonationRating({ rows, volunteerHref, labels }: {
    rows: RatingRow[];
    /** Адрес профиля с {id} */
    volunteerHref: string;
    labels: RatingLabels;
}) {
    const session = useSession();
    const isUser = session.status === "user";
    const [field, setField] = useState<"count" | "total">("count");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [search, setSearch] = useState("");

    const shown = useMemo(() => {
        const query = search.trim().toLowerCase();
        const list = query ? rows.filter((row) => row.name.toLowerCase().includes(query)) : [...rows];
        return list.sort((a, b) => (order === "asc" ? a[field] - b[field] : b[field] - a[field]));
    }, [rows, field, order, search]);

    const sortButton = (value: "asc" | "desc", label: string, path: string) => (
        <button
            type="button"
            aria-label={label}
            aria-pressed={order === value}
            onClick={() => setOrder(value)}
            className={`group flex h-[33px] cursor-pointer items-start max-[460px]:w-full ${order === value ? "text-primary" : "text-caption"}`}
        >
            <svg aria-hidden width="30" height="30" viewBox="0 0 30 30" className="fill-current transition-all duration-300 group-hover:text-primary"><path d={path} /></svg>
        </button>
    );

    return (
        <div className="flex flex-col gap-5">
            <div className="flex w-full items-center justify-between gap-[15px] max-[1200px]:flex-col max-[1200px]:items-start">
                <div className="flex items-center gap-5 max-[460px]:flex-col max-[460px]:items-start">
                    <select
                        aria-label={labels.sortLabel}
                        value={field}
                        onChange={(event) => setField(event.target.value as "count" | "total")}
                        className="h-10 w-[280px] cursor-pointer border border-caption bg-white px-3.5 text-[16px]"
                    >
                        <option value="count">{labels.byCount}</option>
                        <option value="total">{labels.byTotal}</option>
                    </select>
                    <div className="flex items-center gap-2">
                        {sortButton("desc", labels.desc, SORT_DOWN)}
                        {sortButton("asc", labels.asc, SORT_UP)}
                    </div>
                </div>
                <div role="search" className="box-border flex w-full max-w-[370px] items-center rounded-[10px] border border-caption bg-white px-1.5 py-1">
                    <input
                        type="search"
                        aria-label={labels.search}
                        placeholder={labels.search}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="ml-2 box-content h-[23px] min-w-0 flex-1 bg-transparent pt-1 pb-[5px] font-[Roboto,Helvetica,Arial,sans-serif] text-[16px] leading-[23px] text-black/87 outline-none placeholder:text-black/42 [&::-webkit-search-cancel-button]:hidden"
                    />
                    <span className="mr-2 flex h-5 w-5 items-center justify-center">
                        <svg aria-hidden width="18" height="18" viewBox="0 0 18 18" fill="transparent" className="block stroke-caption">
                            <path d="M11.2188 11.2192L16.9996 17.0001M7.1315 13.263C10.5178 13.263 13.263 10.5178 13.263 7.1315C13.263 3.74517 10.5178 1 7.1315 1C3.74517 1 1 3.74517 1 7.1315C1 10.5178 3.74517 13.263 7.1315 13.263Z" strokeWidth="2" />
                        </svg>
                    </span>
                </div>
            </div>
            <div className="h-[65vh] w-full overflow-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {isUser && <th className={`${head} w-[100px] rounded-tl-[4px]`}>ID</th>}
                            <th className={`${head} w-[340px] ${isUser ? "" : "rounded-tl-[4px]"}`}>{labels.name}</th>
                            <th className={`${head} w-[260px]`}>{labels.count}</th>
                            <th className={`${head} w-[260px]`}>{labels.total}</th>
                            <th className={`${head} rounded-tr-[4px]`} />
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((row) => (
                            <tr key={row.id}>
                                {isUser && <td className={`${cell} max-w-[100px] truncate`}>{row.id}</td>}
                                <td className={cell}>
                                    {isUser
                                        ? <a href={volunteerHref.replace("{id}", row.id)} target="_blank" rel="noreferrer" className="text-primary transition-all duration-300 hover:underline">{row.name}</a>
                                        : row.name}
                                </td>
                                <td className={cell}>{row.count}</td>
                                <td className={cell}>{row.total}</td>
                                <td className={cell} />
                            </tr>
                        ))}
                        {shown.length === 0 && (
                            <tr><td colSpan={5} className={`${cell} text-center`}>{labels.empty}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
