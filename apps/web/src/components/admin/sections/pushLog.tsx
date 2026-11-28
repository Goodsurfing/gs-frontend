"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { adminButton, AdminList, type AdminListConfig } from "@/components/admin/AdminList";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminApi } from "@/lib/admin/api";
import {
    CHANNEL_TITLE,
    okPercent,
    PROVIDER_TITLE,
    providerTitle,
    type PushLogItem,
    type PushLogPeriod,
    type PushLogSummary,
    statusMeaning,
    typeTitle,
} from "@/lib/admin/pushLog";

/** Раздел «Пуши»: журнал отправки веб-пушей и пушей в приложение за 30 дней и сводка за 24 часа / 7 дней */

const pill = "inline-block rounded-full px-2 py-0.5 text-[12px]";

function Period({ title, p }: { title: string; p: PushLogPeriod }) {
    const percent = okPercent(p);
    return (
        <section className="flex min-w-[260px] flex-1 flex-col gap-2 rounded-[8px] border border-accent-bg p-3" aria-label={title}>
            <h2 className="text-[16px] font-medium">{title} <span className="text-[12px] font-normal text-muted">с {p.since}</span></h2>
            <p className="text-[14px]">
                Всего: <b>{p.total}</b> · доставлено: <b>{p.ok}</b>{percent !== null && ` (${percent} %)`} · ошибок: <b className={p.errors ? "text-error" : undefined}>{p.errors}</b>
            </p>
            {p.errorsByStatus.length > 0 && (
                <div className="text-[13px]">
                    <div className="text-muted">Ошибки по кодам:</div>
                    <ul>
                        {p.errorsByStatus.map((s) => (
                            <li key={String(s.statusCode)}>
                                {s.statusCode ?? "без кода"} — {s.count}
                                {statusMeaning(s.statusCode) && <span className="text-muted"> ({statusMeaning(s.statusCode)})</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {p.byProvider.length > 0 && (
                <div className="text-[13px]">
                    <div className="text-muted">По сервисам:</div>
                    <ul>
                        {p.byProvider.map((g) => <li key={g.provider}>{providerTitle(g.provider)} — {g.total}, ошибок {g.errors}</li>)}
                    </ul>
                </div>
            )}
            {p.byType.length > 0 && (
                <div className="text-[13px]">
                    <div className="text-muted">По типам:</div>
                    <ul>
                        {p.byType.map((g) => <li key={g.notificationType}>{typeTitle(g.notificationType)} — {g.total}, ошибок {g.errors}</li>)}
                    </ul>
                </div>
            )}
        </section>
    );
}

/** Сводка над журналом: своё состояние загрузки и ошибки, список под ней работает независимо */
export function PushLogSummaryPanel() {
    const api = useAdminApi();
    const [summary, setSummary] = useState<PushLogSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const load = useCallback(() => {
        api.get<PushLogSummary>("push-log/summary").then((data) => {
            setSummary(data);
            setError(null);
        }).catch((e: unknown) => setError(e instanceof Error ? e.message : "Ошибка"));
    }, [api]);
    useEffect(load, [load]);

    if (error) return <div role="alert" className="mb-4 text-[14px]">Сводка не загрузилась: {error} <button type="button" className={adminButton} onClick={load}>Повторить</button></div>;
    if (!summary) return <div className="mb-4"><Spinner /></div>;
    return (
        <div className="mb-4 flex flex-wrap gap-3">
            <Period title="За 24 часа" p={summary.day} />
            <Period title="За 7 дней" p={summary.week} />
        </div>
    );
}

const listConfig: AdminListConfig<PushLogItem> = {
    title: "Пуши",
    path: "push-log",
    rowKey: (r) => String(r.id),
    header: (
        <>
            <p className="mb-3 text-[14px] text-muted">
                Каждая попытка доставить пуш в браузер или приложение за последние 30 дней. Ошибки 404/410 — человек отписался или сбросил браузер (подписка удаляется сама), 403 — не подходят ключи VAPID на сервере.
            </p>
            <PushLogSummaryPanel />
        </>
    ),
    filters: [
        { key: "result", label: "Результат", options: [{ value: "ok", label: "Доставлено" }, { value: "error", label: "Ошибка" }] },
        { key: "provider", label: "Сервис", options: Object.entries(PROVIDER_TITLE).map(([value, label]) => ({ value, label })) },
        { key: "userId", label: "ID пользователя" },
    ],
    columns: [
        { label: "Когда", cell: (r) => r.createdAt, className: "whitespace-nowrap" },
        { label: "Кому", cell: (r) => r.user ? <Link href={`/admin/users/${r.user.id}`}>{r.user.name || r.user.email || r.user.id}</Link> : <span className="text-muted">—</span> },
        { label: "Что", cell: (r) => <span className="flex flex-col">{typeTitle(r.notificationType)}<span className="text-[12px] text-muted">{CHANNEL_TITLE[r.channel] ?? r.channel}</span></span> },
        { label: "Сервис", cell: (r) => providerTitle(r.provider) },
        {
            label: "Результат",
            cell: (r) => r.success
                ? <span className={`${pill} bg-status-accepted/40`}>доставлено</span>
                : (
                    <span className="flex max-w-[420px] flex-col items-start gap-0.5">
                        <span className={`${pill} bg-error/15 text-error`}>ошибка{r.statusCode !== null ? ` ${r.statusCode}` : ""}</span>
                        {statusMeaning(r.statusCode) && <span className="text-[12px] text-muted">{statusMeaning(r.statusCode)}</span>}
                        {r.error && <span className="line-clamp-3 break-all text-[12px]">{r.error}</span>}
                    </span>
                ),
        },
    ],
};

export function PushLogList() {
    return <AdminList config={listConfig} />;
}
