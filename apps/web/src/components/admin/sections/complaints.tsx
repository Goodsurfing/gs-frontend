"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { adminButton, adminButtonDanger, AdminList, type AdminListConfig } from "@/components/admin/AdminList";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { useAdminApi } from "@/lib/admin/api";
import {
    ACTION_CONFIRM,
    ACTION_TITLE,
    type Complaint,
    type ComplaintAction,
    complaintActions,
    complaintLinks,
    REASON_TITLE,
    RESOLUTION_TITLE,
    STATUS_TITLE,
    TARGET_TITLE,
} from "@/lib/admin/complaints";

/** Раздел «Жалобы» (GS-282): жалобы людей и отметки фильтра содержимого. Правила обещают ответ в течение суток. */

const pill = "inline-block rounded-full px-2 py-0.5 text-[12px]";

function Who({ c }: { c: Complaint }) {
    if (c.source === "auto") return <span><span className={`${pill} bg-status-new/40`}>Фильтр</span>{c.matched && <span className="block text-[12px] text-muted">нашёл: {c.matched}</span>}</span>;
    if (!c.reporter) return <span className="text-muted">удалён</span>;
    return (
        <span className="flex flex-col">
            <Link href={`/admin/users/${c.reporter.id}`}>{c.reporter.name || c.reporter.email}</Link>
            <span className="text-[12px] text-muted">{c.reporter.email}</span>
        </span>
    );
}

function Target({ c }: { c: Complaint }) {
    return (
        <span className="flex flex-col gap-0.5">
            <span className="font-medium">{TARGET_TITLE[c.targetType] ?? c.targetType}</span>
            {complaintLinks(c).map((link) => <a key={link.href} href={link.href} target={link.href.startsWith("/admin") ? undefined : "_blank"} rel="noreferrer" className="text-[13px]">{link.label}</a>)}
        </span>
    );
}

function Status({ c }: { c: Complaint }) {
    return (
        <span className="flex flex-col items-start gap-1">
            <span className={`${pill} ${c.status === "new" ? "bg-status-new/40" : "bg-accent-bg text-muted"}`}>{STATUS_TITLE[c.status] ?? c.status}</span>
            {c.resolution && <span className="text-[12px] text-muted">{RESOLUTION_TITLE[c.resolution]}{c.resolvedBy ? `, ${c.resolvedBy}` : ""}</span>}
        </span>
    );
}

const listConfig: AdminListConfig<Complaint> = {
    title: "Жалобы",
    path: "complaints",
    rowKey: (c) => String(c.id),
    rowHref: (c) => `/admin/complaints/${c.id}`,
    header: <p className="mb-3 text-[14px] text-muted">Жалобы людей на сообщения, пользователей и отзывы и отметки фильтра (ссылки-спам, запрещённые слова). По правилам сервиса жалобу рассматриваем в течение суток.</p>,
    filters: [
        { key: "status", label: "Статус", options: [{ value: "new", label: "Новые" }, { value: "resolved", label: "Разобранные" }, { value: "all", label: "Все" }], defaultValue: "new" },
        { key: "source", label: "Источник", options: [{ value: "user", label: "От людей" }, { value: "auto", label: "Фильтр" }] },
    ],
    columns: [
        { label: "№", cell: (c) => <span className="whitespace-nowrap">№{c.id}<span className="block text-[12px] text-muted">{c.createdAt}</span></span> },
        { label: "Причина", cell: (c) => REASON_TITLE[c.reason] ?? c.reason },
        { label: "На что", cell: (c) => <Target c={c} /> },
        { label: "Кто", cell: (c) => <Who c={c} /> },
        {
            label: "Текст",
            cell: (c) => (
                <div className="max-w-[420px]">
                    {c.excerpt && <p className="line-clamp-3 whitespace-pre-wrap">{c.excerpt}</p>}
                    {c.comment && <p className="mt-1 text-[13px] text-muted">Комментарий: {c.comment}</p>}
                </div>
            ),
        },
        { label: "Статус", cell: (c) => <Status c={c} /> },
    ],
};

export function ComplaintsList() {
    return <AdminList config={listConfig} />;
}

/** Карточка жалобы с разбором: «Разобрано», «Скрыть отзыв», «Отключить пользователя» */
export function ComplaintCard({ id }: { id: string }) {
    const api = useAdminApi();
    const [item, setItem] = useState<Complaint | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [confirm, setConfirm] = useState<ComplaintAction | null>(null);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    const load = useCallback(() => {
        api.get<Complaint>(`complaints/${id}`).then((data) => {
            setItem(data);
            setError(null);
        }).catch((e: unknown) => setError(e instanceof Error ? e.message : "Ошибка"));
    }, [api, id]);
    useEffect(load, [load]);

    const resolve = async (action: ComplaintAction) => {
        setBusy(true);
        try {
            setItem(await api.post<Complaint>(`complaints/${id}/resolve`, { action }));
            setToast({ text: `${ACTION_TITLE[action]} — готово`, ok: true });
        } catch (e) {
            setToast({ text: e instanceof Error ? e.message : "Ошибка", ok: false });
        } finally {
            setBusy(false);
            setConfirm(null);
        }
    };

    if (error) return <div role="alert" className="p-4">{error} <button type="button" className={adminButton} onClick={load}>Повторить</button></div>;
    if (!item) return <div className="p-4"><Spinner /></div>;
    const actions = complaintActions(item);
    const row = (label: string, value: React.ReactNode) => (
        <div className="grid grid-cols-[180px_1fr] gap-3 border-b border-accent-bg py-2 down-md:grid-cols-1 down-md:gap-0.5">
            <dt className="text-muted">{label}</dt>
            <dd>{value}</dd>
        </div>
    );
    return (
        <div className="flex max-w-[900px] flex-col gap-4">
            <Link href="/admin/complaints" className="text-[14px]">← Все жалобы</Link>
            <h1 className="text-[22px] font-medium">Жалоба №{item.id}</h1>
            <dl>
                {row("Когда", item.createdAt)}
                {row("Статус", <Status c={item} />)}
                {row("Причина", REASON_TITLE[item.reason] ?? item.reason)}
                {row("На что", <Target c={item} />)}
                {row("Кто пожаловался", <Who c={item} />)}
                {item.targetUser && row("Нарушитель", (
                    <span>
                        {item.targetUser.name} · {item.targetUser.email} · {item.targetUser.isActive ? "активен" : <span className="text-error">отключён</span>}
                        {item.sameUserCount ? <span className="block text-[13px] text-muted">Других жалоб на него: {item.sameUserCount}</span> : null}
                    </span>
                ))}
                {item.excerpt && row("Текст на момент жалобы", <p className="whitespace-pre-wrap">{item.excerpt}</p>)}
                {item.comment && row("Комментарий", <p className="whitespace-pre-wrap">{item.comment}</p>)}
                {item.reviewActive !== null && row("Отзыв на сайте", item.reviewActive ? "виден" : "скрыт")}
            </dl>
            {actions.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {actions.map((action) => (
                        <button key={action} type="button" disabled={busy} className={action === "none" ? adminButton : adminButtonDanger} onClick={() => setConfirm(action)}>
                            {ACTION_TITLE[action]}
                        </button>
                    ))}
                </div>
            )}
            <ConfirmDialog
                open={confirm !== null}
                text={confirm ? ACTION_CONFIRM[confirm] : ""}
                confirm={confirm ? ACTION_TITLE[confirm] : ""}
                cancel="Отмена"
                busy={busy}
                onConfirm={() => confirm && void resolve(confirm)}
                onClose={() => setConfirm(null)}
            />
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
        </div>
    );
}
