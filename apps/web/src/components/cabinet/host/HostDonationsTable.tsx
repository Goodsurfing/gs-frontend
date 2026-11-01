"use client";

import type { components } from "@goodsurfing/api";
import { useEffect, useMemo, useState } from "react";

import { RatingSearch, SortButtons } from "@/components/donation/DonationRating";
import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { browserApi } from "@/lib/browserApi";

type Donation = components["schemas"]["HostListResult"];

export interface HostDonationsLabels {
    sortLabel: string;
    byCount: string;
    byTotal: string;
    desc: string;
    asc: string;
    searchFundraise: string;
    searchDonor: string;
    name: string;
    fundraise: string;
    amount: string;
    date: string;
    empty: string;
}

const cell = "h-[52px] border-b border-[#e0e0e0] px-2.5 text-left text-[0.875rem]";
const head = "h-14 border-b border-[#e0e0e0] bg-field px-2.5 text-left text-[0.875rem] font-bold";

/**
 * Пожертвования организатору (HostDonationsTable старого фронта): первые 100
 * с сервера, поиск по сбору и жертвователю и сортировка по сумме — в браузере.
 * Выбор «по количеству / по сумме» в старом ничего не делал — оставлен для
 * вида, сортировка всегда по сумме.
 */
export function HostDonationsTable({ volunteerHref, labels }: {
    /** Адрес профиля с {id} */
    volunteerHref: string;
    labels: HostDonationsLabels;
}) {
    const session = useSession();
    const [rows, setRows] = useState<Donation[] | null>(null);
    const [field, setField] = useState("count");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [donor, setDonor] = useState("");
    const [fundraise, setFundraise] = useState("");

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token).GET("/api/v1/donation/host", { params: { query: { page: 1, limit: 100 } as never } })
            .then(({ data }) => { if (!cancelled) setRows(data?.data ?? []); })
            .catch(() => { if (!cancelled) setRows([]); });
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token]);

    const shown = useMemo(() => {
        const byDonor = donor.toLowerCase();
        const byFundraise = fundraise.toLowerCase();
        // Анонимные пожертвования без имени: в старом поиск на них падал
        return (rows ?? [])
            .filter((row) => (row.donorName ?? "").toLowerCase().includes(byDonor) && (row.fundraiseName ?? "").toLowerCase().includes(byFundraise))
            .sort((a, b) => (order === "asc" ? a.amount - b.amount : b.amount - a.amount));
    }, [rows, donor, fundraise, order]);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex w-full items-center justify-between gap-[15px] down-1200:flex-col down-1200:items-start">
                <div className="flex items-center gap-5 down-460:flex-col down-460:items-start">
                    <select
                        aria-label={labels.sortLabel}
                        value={field}
                        onChange={(event) => setField(event.target.value)}
                        className="h-10 w-[280px] cursor-pointer border border-caption bg-white px-3.5 text-[16px] down-460:w-full"
                    >
                        <option value="count">{labels.byCount}</option>
                        <option value="total">{labels.byTotal}</option>
                    </select>
                    <div className="flex items-center gap-2"><SortButtons order={order} onChange={setOrder} labels={labels} /></div>
                </div>
                <RatingSearch label={labels.searchFundraise} value={fundraise} onChange={setFundraise} />
                <RatingSearch label={labels.searchDonor} value={donor} onChange={setDonor} />
            </div>
            <div className="h-[65vh] w-full overflow-auto">
                {rows === null ? <Loading className="min-h-[200px]" /> : (
                    // Колонки фиксированной ширины, как в DataGrid: на узком экране таблица прокручивается
                    <table className="w-full min-w-[1100px] table-fixed border-collapse">
                        <thead>
                            <tr>
                                <th className={`${head} w-[100px] rounded-tl-[4px]`}>ID</th>
                                <th className={`${head} w-[280px]`}>{labels.name}</th>
                                <th className={`${head} w-[260px]`}>{labels.fundraise}</th>
                                <th className={`${head} w-[260px]`}>{labels.amount}</th>
                                <th className={`${head} w-[200px]`}>{labels.date}</th>
                                <th className={`${head} rounded-tr-[4px]`} />
                            </tr>
                        </thead>
                        <tbody>
                            {/* id — жертвователя, у повторных пожертвований он одинаковый: ключ по номеру строки */}
                            {shown.map((row, index) => (
                                <tr key={`${row.id}-${index}`}>
                                    <td className={`${cell} max-w-[100px] truncate`}>{row.id}</td>
                                    <td className={cell}>
                                        {row.donorName
                                            ? <a href={volunteerHref.replace("{id}", row.id)} target="_blank" rel="noreferrer" className="text-primary transition-all duration-300 hover:underline">{row.donorName}</a>
                                            : null}
                                    </td>
                                    <td className={cell}>{row.fundraiseName}</td>
                                    <td className={cell}>{row.amount}</td>
                                    {/* Дата строкой d.m.Y — как пришла */}
                                    <td className={cell}>{row.createdAt}</td>
                                    <td className={cell} />
                                </tr>
                            ))}
                            {shown.length === 0 && <tr><td colSpan={6} className={`${cell} text-center`}>{labels.empty}</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
