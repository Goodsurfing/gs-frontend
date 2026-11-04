"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { DashboardStats } from "@/components/admin/sections/DashboardStats";
import { Spinner } from "@/components/ui/Spinner";
import { type AdminPage, type AdminQuery, useAdminApi } from "@/lib/admin/api";

interface Tile {
    label: string;
    path: string;
    query?: AdminQuery;
    href: string;
}

// Итоги разделов — из счётчиков списков API админки (limit=1 → pagination.total); остальное — в DashboardStats
const TILES: Tile[] = [
    { label: "Организации", path: "organization", href: "/admin/organizations" },
    { label: "Организации с членством", path: "organization", query: { membershipStatus: "active" }, href: "/admin/organizations?membershipStatus=active" },
    { label: "Вакансии", path: "vacancy", href: "/admin/vacancies" },
    { label: "Сборы", path: "fundraise/", href: "/admin/donations" },
];

interface MembershipLogEntry {
    id: number;
    createdAt: string;
    action: string;
    tariffCode: string | null;
    adminName: string | null;
    userId: string;
    userName: string | null;
    userEmail: string | null;
}

const ACTIONS: Record<string, string> = { GRANT: "выдано", REVOKE: "отозвано" };

/** Главная админки: итоги по разделам и последние действия с членством */
export function AdminDashboard() {
    const api = useAdminApi();
    const [totals, setTotals] = useState<Record<string, number | null>>({});
    const [log, setLog] = useState<MembershipLogEntry[] | null>(null);

    useEffect(() => {
        let cancelled = false;
        TILES.forEach((tile) => {
            api.get<AdminPage<unknown>>(tile.path, { ...tile.query, page: 1, limit: 1 })
                .then((res) => !cancelled && setTotals((t) => ({ ...t, [tile.label]: res.pagination?.total ?? null })))
                .catch(() => !cancelled && setTotals((t) => ({ ...t, [tile.label]: null })));
        });
        api.get<AdminPage<MembershipLogEntry>>("membership/log", { page: 1, limit: 10 })
            .then((res) => !cancelled && setLog(res.data ?? []))
            .catch(() => !cancelled && setLog([]));
        return () => {
            cancelled = true;
        };
    }, [api]);

    return (
        <section>
            <h1 className="mb-4 text-[22px] font-bold">Сводка</h1>
            <DashboardStats />
            <h2 className="mb-3 text-[18px] font-bold">Разделы</h2>
            <div className="mb-8 grid grid-cols-4 gap-3 down-lg:grid-cols-2">
                {TILES.map((tile) => {
                    const value = totals[tile.label];
                    return (
                        <Link key={tile.label} href={tile.href} className="rounded-[8px] bg-surface p-4 hover:shadow-md">
                            <p className="text-[12px] text-muted">{tile.label}</p>
                            <p className="mt-1 text-[26px] font-bold">
                                {value === undefined ? <span className="text-muted">…</span> : value === null ? "—" : value.toLocaleString("ru-RU")}
                            </p>
                        </Link>
                    );
                })}
            </div>

            <div className="mb-3 flex items-center gap-3">
                <h2 className="text-[18px] font-bold">Последние действия с членством</h2>
                <Link href="/admin/membership-log" className="text-primary hover:underline">весь журнал</Link>
            </div>
            <div className="rounded-[8px] bg-surface">
                {log === null && <div className="flex justify-center p-6"><Spinner /></div>}
                {log?.length === 0 && <p className="p-6 text-center text-muted">Записей нет</p>}
                {log?.map((entry) => (
                    <div key={entry.id} className="flex flex-wrap gap-x-3 border-b border-accent-bg/60 px-4 py-2 last:border-0">
                        <span className="text-muted">{entry.createdAt.slice(0, 16).replace("T", " ")}</span>
                        <span>{ACTIONS[entry.action] ?? entry.action}</span>
                        <span>{entry.tariffCode}</span>
                        <Link href={`/admin/users/${entry.userId}`} className="text-primary hover:underline">{entry.userName || entry.userEmail}</Link>
                        <span className="text-muted">— {entry.adminName}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
