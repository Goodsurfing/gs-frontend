"use client";

import { AdminList, type AdminListConfig, YesNo } from "@/components/admin/AdminList";

/** Строка списка пользователей (/admin/v1/user) */
export interface AdminUserRow {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    created: string | null;
    lastVisit: string | null;
    isVerified: boolean;
    isVolunteer: boolean;
    isOrganization: boolean;
    isActive: boolean;
    isPayment: boolean;
    endPayment: string | null;
    isPrivilegedMembership: boolean;
    internationalEndPayment: string | null;
}

const fullName = (r: { firstName: string | null; lastName: string | null }) => [r.firstName, r.lastName].filter(Boolean).join(" ") || "—";

const SORTS = [
    ["created:desc", "Создан ↓"], ["created:asc", "Создан ↑"], ["lastVisit:desc", "Последний визит ↓"], ["lastVisit:asc", "Последний визит ↑"],
    ["fio:asc", "ФИО ↑"], ["fio:desc", "ФИО ↓"], ["email:asc", "Email ↑"], ["email:desc", "Email ↓"],
    ["isPayment:desc", "С членством сначала"], ["isEndPayment:asc", "Окончание членства ↑"], ["isEndPayment:desc", "Окончание членства ↓"],
    ["isActive:asc", "Неактивные сначала"], ["isVerified:asc", "Неподтверждённые сначала"],
].map(([value, label]) => ({ value: value!, label: label! }));

export const usersConfig: AdminListConfig<AdminUserRow> = {
    title: "Пользователи",
    path: "user",
    rowKey: (r) => r.id,
    rowHref: (r) => `/admin/users/${r.id}`,
    defaultSort: "created:desc",
    sorts: SORTS,
    filters: [
        { key: "email", label: "Email" },
        { key: "firstName", label: "Имя" },
        { key: "lastName", label: "Фамилия" },
        { key: "id", label: "ID" },
        { key: "membershipStatus", label: "Членство", options: [{ value: "active", label: "Активно" }, { value: "inactive", label: "Неактивно" }] },
    ],
    columns: [
        { label: "Пользователь", cell: (r) => <span>{fullName(r)}<span className="block text-[12px] text-muted">{r.email}</span></span> },
        { label: "Создан", cell: (r) => r.created ?? "—", className: "whitespace-nowrap" },
        { label: "Визит", cell: (r) => r.lastVisit ?? "—", className: "whitespace-nowrap" },
        { label: "Гудсёрфер", cell: (r) => <YesNo value={r.isVolunteer} /> },
        { label: "Организация", cell: (r) => <YesNo value={r.isOrganization} /> },
        { label: "Почта подтверждена", cell: (r) => <YesNo value={r.isVerified} /> },
        { label: "Активен", cell: (r) => <YesNo value={r.isActive} /> },
        {
            label: "Членство",
            cell: (r) => r.isPayment
                ? <span>до {r.endPayment ?? "бессрочно"}{r.isPrivilegedMembership && <span className="ml-1 text-[12px] text-muted">(привилегированное)</span>}</span>
                : <span className="text-muted">нет</span>,
            className: "whitespace-nowrap",
        },
        { label: "Международный клуб", cell: (r) => r.internationalEndPayment ? `до ${r.internationalEndPayment}` : <span className="text-muted">—</span>, className: "whitespace-nowrap" },
    ],
    remove: { path: (r) => `user/${r.id}`, confirm: (r) => `Удалить пользователя ${r.email}? Это необратимо.` },
};

export function UsersList() {
    return <AdminList config={usersConfig} />;
}
