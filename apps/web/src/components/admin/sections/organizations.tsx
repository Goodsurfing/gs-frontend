"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AdminForm, type AdminFormConfig } from "@/components/admin/AdminForm";
import { adminButton, adminButtonDanger, AdminList, type AdminListConfig, YesNo } from "@/components/admin/AdminList";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { useAdminApi } from "@/lib/admin/api";

/** Строка списка организаций (/admin/v1/organization) */
interface OrganizationRow {
    id: string;
    name: string;
    firstName: string | null;
    lastName: string | null;
    isActive: boolean;
    countVacancies: number;
    countApplications: number;
    isMembership: boolean;
    endMembership: string | null;
}

const SORTS = [
    ["name:asc", "Название ↑"], ["name:desc", "Название ↓"], ["fio:asc", "Владелец ↑"], ["fio:desc", "Владелец ↓"],
    ["countVacancies:desc", "Больше вакансий"], ["countApplications:desc", "Больше заявок"], ["isActive:asc", "Неактивные сначала"],
    ["isPayment:desc", "С членством сначала"], ["isEndPayment:asc", "Окончание членства ↑"],
].map(([value, label]) => ({ value: value!, label: label! }));

const listConfig: AdminListConfig<OrganizationRow> = {
    title: "Организации",
    path: "organization",
    rowKey: (r) => r.id,
    rowHref: (r) => `/admin/organizations/${r.id}`,
    defaultSort: "name:asc",
    sorts: SORTS,
    filters: [
        { key: "name", label: "Название" },
        { key: "firstName", label: "Имя владельца" },
        { key: "lastName", label: "Фамилия владельца" },
        { key: "membershipStatus", label: "Членство", options: [{ value: "active", label: "Активно" }, { value: "inactive", label: "Неактивно" }] },
    ],
    columns: [
        { label: "Организация", cell: (r) => r.name || "—" },
        { label: "Владелец", cell: (r) => [r.firstName, r.lastName].filter(Boolean).join(" ") || "—" },
        { label: "Вакансий", cell: (r) => r.countVacancies, className: "text-right" },
        { label: "Заявок", cell: (r) => r.countApplications, className: "text-right" },
        { label: "Активна", cell: (r) => <YesNo value={r.isActive} /> },
        { label: "Членство", cell: (r) => r.isMembership ? `до ${r.endMembership ?? "бессрочно"}` : <span className="text-muted">нет</span>, className: "whitespace-nowrap" },
    ],
    remove: { path: (r) => `organization/${r.id}`, confirm: (r) => `Удалить организацию «${r.name}»? Её вакансии перестанут показываться.` },
};

export function OrganizationsList() {
    return <AdminList config={listConfig} />;
}

const TEXT = [
    ["name", "Название"], ["type", "Тип"], ["otherType", "Другой тип"], ["address", "Адрес"], ["website", "Сайт"],
    ["vk", "ВКонтакте"], ["telegram", "Telegram"], ["instagram", "Instagram"], ["facebook", "Facebook"],
] as const;

// Поля, которые API не принимает обратно (считаются сами) — остальное отправляем целиком: PATCH перезаписывает организацию
const READ_ONLY = new Set(["id", "image", "countVacancies", "countApplications", "sleepingSince", "sleepWarnedAt", "sleepExempt", "isHostMembership", "membershipEndDate", "isPrivilegedMembership"]);

const formConfig: AdminFormConfig = {
    title: (r) => String(r?.name ?? "Организация"),
    back: { href: "/admin/organizations", label: "Организации" },
    load: (id) => `organization/${id}`,
    format: "json",
    fields: [
        // Обязательные — как проверяет API (name, type, website, описания)
        ...TEXT.map(([key, label]) => ({ key, label, required: key === "name" || key === "type" || key === "website" })),
        { key: "shortDescription", label: "Кратко", type: "textarea", required: true },
        { key: "description", label: "Описание", type: "textarea", required: true },
    ],
    create: { method: "POST", path: "organization" },
    update: (id) => ({ method: "PATCH", path: `organization/${id}` }),
    toBody: (values, record) => {
        const base = Object.fromEntries(Object.entries(record ?? {}).filter(([k]) => !READ_ONLY.has(k)));
        const image = (record?.image as { id?: string } | null | undefined) ?? null;
        return { ...base, ...values, imageId: image?.id ?? null };
    },
    extra: (record, reload) => <OrganizationActions record={record} reload={reload} />,
};

/** Блокировка, членство и удаление организации (AdminOrganizationSettings старой админки) */
function OrganizationActions({ record, reload }: { record: Record<string, unknown>; reload: () => void }) {
    const api = useAdminApi();
    const router = useRouter();
    const id = String(record.id);
    const active = record.isActive === true;
    const exempt = record.sleepExempt === true;
    const [confirm, setConfirm] = useState<null | "toggle" | "membership" | "delete">(null);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    const run = async (action: () => Promise<unknown>, ok: string, after?: () => void) => {
        setBusy(true);
        try {
            await action();
            setToast({ text: ok, ok: true });
            if (after) after();
            else reload();
        } catch (e) {
            setToast({ text: e instanceof Error ? e.message : "Ошибка", ok: false });
        } finally {
            setBusy(false);
            setConfirm(null);
        }
    };

    return (
        <section className="mb-5 rounded-[8px] bg-surface p-4">
            <h2 className="mb-3 text-[16px] font-bold">Управление</h2>
            <dl className="mb-4 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1.5">
                <dt className="text-muted">Вакансий / заявок</dt><dd>{String(record.countVacancies ?? 0)} / {String(record.countApplications ?? 0)}</dd>
                <dt className="text-muted">Активна</dt><dd><YesNo value={active} /></dd>
                <dt className="text-muted">Членство организатора</dt>
                <dd>{record.isHostMembership ? `до ${String(record.membershipEndDate ?? "бессрочно")}` : "нет"}{record.isPrivilegedMembership === true && <span className="ml-1 text-[12px] text-muted">(привилегированное)</span>}</dd>
                <dt className="text-muted">Спящий организатор</dt>
                <dd>
                    {exempt ? "не помечать (решение администратора)" : record.sleepingSince ? `с ${String(record.sleepingSince)} — отметка «давно не заходил», вакансии ниже в каталоге` : record.sleepWarnedAt ? `предупреждён ${String(record.sleepWarnedAt)}, отметка через 7 дней` : "нет"}
                </dd>
                <dt className="text-muted">На сайте</dt><dd><a href={`/organizations/${id}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">страница организации</a></dd>
            </dl>
            <div className="flex flex-wrap gap-2">
                <button type="button" className={active ? adminButtonDanger : adminButton} disabled={busy} onClick={() => setConfirm("toggle")}>{active ? "Деактивировать" : "Активировать"}</button>
                <button type="button" className={adminButton} disabled={busy} onClick={() => void run(() => api.post(`organization/${id}/sleep-exempt`, { exempt: !exempt }), exempt ? "Снова по общим правилам" : "Вакансии не будут помечаться")}>
                    {exempt ? "Помечать, если давно не заходит" : "Не помечать вакансии"}
                </button>
                {!record.isHostMembership && <button type="button" className={adminButton} disabled={busy} onClick={() => setConfirm("membership")}>Активировать членство</button>}
                <button type="button" className={adminButtonDanger} disabled={busy} onClick={() => setConfirm("delete")}>Удалить организацию</button>
            </div>
            <ConfirmDialog
                open={confirm !== null}
                text={confirm === "delete" ? "Удалить организацию? Её вакансии перестанут показываться." : confirm === "membership" ? "Активировать членство организатора?" : active ? "Деактивировать организацию?" : "Активировать организацию?"}
                confirm={confirm === "delete" ? "Удалить" : "Да"}
                cancel="Отмена"
                busy={busy}
                onConfirm={() => {
                    if (confirm === "delete") void run(() => api.del(`organization/${id}`), "Организация удалена", () => router.push("/admin/organizations"));
                    else if (confirm === "membership") void run(() => api.post(`organization/${id}/activate-membership`), "Членство активировано");
                    else void run(() => api.post(`organization/${id}/toggle-active`), active ? "Деактивирована" : "Активирована");
                }}
                onClose={() => setConfirm(null)}
            />
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
        </section>
    );
}

export function OrganizationCard({ id }: { id: string }) {
    return <AdminForm config={formConfig} id={id} />;
}
