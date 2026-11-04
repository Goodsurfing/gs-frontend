"use client";

import Link from "next/link";
import { useState } from "react";

import { adminButton, adminButtonPrimary, adminInput, AdminList, type AdminListConfig } from "@/components/admin/AdminList";
import { Toast } from "@/components/ui/Toast";
import { useAdminApi } from "@/lib/admin/api";

/* ── Журнал членства ── */

interface MembershipLogRow {
    id: number;
    createdAt: string;
    action: string;
    category: string;
    tariffCode: string | null;
    endDate: string | null;
    comment: string | null;
    adminName: string | null;
    adminEmail: string | null;
    userId: string;
    userName: string | null;
    userEmail: string | null;
}

const isoDateTime = (v: string | null) => v ? v.slice(0, 16).replace("T", " ") : "—";

const membershipLogConfig: AdminListConfig<MembershipLogRow> = {
    title: "Журнал членства",
    path: "membership/log",
    rowKey: (r) => String(r.id),
    columns: [
        { label: "Когда", cell: (r) => isoDateTime(r.createdAt), className: "whitespace-nowrap" },
        { label: "Действие", cell: (r) => r.action === "GRANT" ? "выдано" : r.action === "REVOKE" ? "снято" : r.action },
        { label: "Тариф", cell: (r) => r.tariffCode ?? r.category },
        { label: "До", cell: (r) => r.action === "GRANT" ? (r.endDate ? r.endDate.slice(0, 10).split("-").reverse().join(".") : "бессрочно") : "—", className: "whitespace-nowrap" },
        { label: "Кому", cell: (r) => <Link href={`/admin/users/${r.userId}`} className="text-primary hover:underline">{r.userName || r.userEmail}</Link> },
        { label: "Кто", cell: (r) => r.adminName || r.adminEmail || "—" },
        { label: "Комментарий", cell: (r) => r.comment || "—" },
    ],
};

export function MembershipLogList() {
    return <AdminList config={membershipLogConfig} />;
}

/* ── Обращения (форма обратной связи) ── */

interface FeedbackRow { id: string; name: string; email: string; message: string; status: "NEW" | "PROCESSED"; created: string }

const feedbackConfig: AdminListConfig<FeedbackRow> = {
    title: "Обращения",
    path: "feedback/",
    rowKey: (r) => r.id,
    defaultSort: "created:desc",
    sorts: [{ value: "created:desc", label: "Новые сначала" }, { value: "created:asc", label: "Старые сначала" }],
    filters: [{ key: "status", label: "Статус", options: [{ value: "NEW", label: "Новые" }, { value: "PROCESSED", label: "Обработанные" }] }],
    columns: [
        { label: "Когда", cell: (r) => r.created, className: "whitespace-nowrap" },
        { label: "От кого", cell: (r) => <span>{r.name}<a href={`mailto:${r.email}`} className="block text-[12px] text-primary hover:underline">{r.email}</a></span> },
        { label: "Сообщение", cell: (r) => <p className="max-w-[560px] whitespace-pre-wrap">{r.message}</p> },
        { label: "Статус", cell: (r) => r.status === "NEW" ? <span className="rounded-full bg-status-new/40 px-2 py-0.5 text-[12px]">новое</span> : <span className="text-[12px] text-muted">обработано</span> },
    ],
    actions: (r, { api, reload, notify }) => (
        <button
            type="button"
            className={adminButton}
            onClick={() => void api.patch(`feedback/${r.id}`, { status: r.status === "NEW" ? "PROCESSED" : "NEW" })
                .then(() => {
                    notify(r.status === "NEW" ? "Отмечено обработанным" : "Возвращено в новые", true);
                    reload();
                })
                .catch((e: unknown) => notify(e instanceof Error ? e.message : "Ошибка"))}
        >
            {r.status === "NEW" ? "Обработано" : "Вернуть в новые"}
        </button>
    ),
    remove: { path: (r) => `feedback/${r.id}`, confirm: (r) => `Удалить обращение от ${r.email}?` },
};

export function FeedbackList() {
    return <AdminList config={feedbackConfig} />;
}

/* ── Администраторы ── */

interface AdminRow { id: string; firstName: string | null; lastName: string | null; email: string }

const systemAdminConfig: AdminListConfig<AdminRow> = {
    title: "Администраторы",
    path: "system-admin",
    rowKey: (r) => r.id,
    rowHref: (r) => `/admin/users/${r.id}`,
    columns: [
        { label: "Имя", cell: (r) => [r.firstName, r.lastName].filter(Boolean).join(" ") || "—" },
        { label: "Email", cell: (r) => r.email },
    ],
    remove: { path: (r) => `system-admin/${r.id}`, confirm: (r) => `Снять права администратора с ${r.email}?` },
};

/** Добавить администратора: поиск пользователя по точному email (system-admin/search) и выдача роли */
function AddAdmin() {
    const api = useAdminApi();
    const [email, setEmail] = useState("");
    const [found, setFound] = useState<{ id: string; firstName: string | null; lastName: string | null }[] | null>(null);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    return (
        <div className="mb-4 rounded-[8px] bg-surface p-3">
            <form
                className="flex flex-wrap items-end gap-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    void api.get<{ id: string; firstName: string | null; lastName: string | null }[]>("system-admin/search", { email: email.trim(), limit: 5 })
                        .then(setFound)
                        .catch((err: unknown) => setToast({ text: err instanceof Error ? err.message : "Ошибка", ok: false }));
                }}
            >
                <label className="flex min-w-[280px] flex-col gap-1 text-[12px] text-muted">
                    Добавить администратора — email пользователя
                    <input type="email" required className={adminInput} value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <button type="submit" className={adminButton}>Найти</button>
            </form>
            {found?.length === 0 && <p className="mt-2 text-muted">Пользователь не найден</p>}
            {found?.map((u) => (
                <div key={u.id} className="mt-2 flex items-center gap-3">
                    <span>{[u.firstName, u.lastName].filter(Boolean).join(" ") || u.id}</span>
                    <button
                        type="button"
                        className={adminButtonPrimary}
                        onClick={() => void api.post("system-admin/add-role", { id: u.id })
                            .then(() => {
                                setToast({ text: "Права администратора выданы — обновите список", ok: true });
                                setFound(null);
                                setEmail("");
                            })
                            .catch((err: unknown) => setToast({ text: err instanceof Error ? err.message : "Ошибка", ok: false }))}
                    >
                        Сделать администратором
                    </button>
                </div>
            ))}
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
        </div>
    );
}

export function SystemAdminList() {
    return <AdminList config={{ ...systemAdminConfig, header: <AddAdmin /> }} />;
}
