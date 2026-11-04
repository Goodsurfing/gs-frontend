"use client";

import Link from "next/link";
import { type ReactNode, useCallback, useEffect, useState } from "react";

import { adminButton, adminButtonDanger, adminButtonPrimary, adminInput, YesNo } from "@/components/admin/AdminList";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { type AdminPage, useAdminApi } from "@/lib/admin/api";

interface Named { id: number; name: string }

/** Пользователь в API админки (GET /admin/v1/user/{id}) */
interface AdminUser {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    birthDate: string | null;
    gender: string | null;
    image: { id: string } | null;
    country: string | null;
    city: string | null;
    locale: string;
    phone: string | null;
    aboutMe: string | null;
    vk: string | null;
    facebook: string | null;
    instagram: string | null;
    telegram: string | null;
    additionalSkills: string[];
    skills: Named[];
    achievements: Named[];
    created: string | null;
    lastVisit: string | null;
    isVerified: boolean;
    isVolunteer: boolean;
    isOrganization: boolean;
    isActive: boolean;
    isDelete: boolean;
    isPayment: boolean;
    endPayment: string | null;
    isPrivilegedMembership?: boolean;
    internationalEndPayment?: string | null;
    marketingConsent?: { consent: boolean; at: string | null; source: string | null; history: { consent: boolean; source: string; at: string; ip: string | null }[] };
}

interface Membership {
    id: string;
    tariffCode: string;
    tariffName: string;
    category: string;
    status: string;
    source: string;
    privileged: boolean;
    active: boolean;
    startDate: string | null;
    endDate: string | null;
}

interface Tariff { code: string; name: string; forRole: string; category: string; durationDays: number }

const TEXT_FIELDS: [keyof AdminUser, string][] = [
    ["firstName", "Имя"], ["lastName", "Фамилия"], ["birthDate", "Дата рождения (ГГГГ-ММ-ДД)"], ["phone", "Телефон"],
    ["country", "Страна"], ["city", "Город"], ["vk", "ВКонтакте"], ["telegram", "Telegram"], ["instagram", "Instagram"], ["facebook", "Facebook"],
];

const SOURCES: Record<string, string> = {
    registration: "при регистрации", profile: "в профиле", email_request: "по письму", unisender: "Unisender",
    account_deleted: "аккаунт удалён", existing_user: "старый пользователь", unsubscribe_link: "ссылка отписки",
};

/** ISO-дата → дд.мм.гггг */
const isoDate = (value: string | null) => value ? value.slice(0, 10).split("-").reverse().join(".") : "бессрочно";
const ymd = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
};

/**
 * Тело PATCH /admin/v1/user/{id}: API перезаписывает пользователя целиком, поэтому
 * отправляем все поля, а не только изменённые (как adminUpdateUserAdapter старой админки).
 */
export function userUpdateBody(user: AdminUser, changes: Partial<AdminUser> & { skillIds?: number[]; achievementIds?: number[] } = {}) {
    const u = { ...user, ...changes };
    return {
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        birthDate: u.birthDate || null,
        // Старая админка подставляла «male» вместо пустого пола и портила данные; API принимает null
        gender: u.gender || null,
        country: u.country ?? "",
        city: u.city ?? "",
        locale: u.locale,
        phone: u.phone ?? "",
        aboutMe: u.aboutMe ?? "",
        vk: u.vk ?? "",
        facebook: u.facebook ?? "",
        instagram: u.instagram ?? "",
        telegram: u.telegram ?? "",
        additionalSkills: u.additionalSkills ?? [],
        imageId: u.image?.id ?? null,
        skillIds: changes.skillIds ?? user.skills.map((s) => s.id),
        achievementIds: changes.achievementIds ?? user.achievements.map((a) => a.id),
    };
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="mb-5 rounded-[8px] bg-surface p-4">
            <h2 className="mb-3 text-[16px] font-bold">{title}</h2>
            {children}
        </section>
    );
}

/** Карточка пользователя (AdminUserPersonalPage старой админки) */
export function UserCard({ id }: { id: string }) {
    const api = useAdminApi();
    const [user, setUser] = useState<AdminUser | null | "error">(null);
    const [form, setForm] = useState<Partial<AdminUser>>({});
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const [busy, setBusy] = useState(false);
    const [confirm, setConfirm] = useState<null | "delete" | "block">(null);
    const notify = (text: string, ok = false) => setToast({ text, ok });

    const load = useCallback(() => {
        api.get<AdminUser>(`user/${id}`).then((u) => {
            setUser(u);
            setForm({});
        }).catch(() => setUser("error"));
    }, [api, id]);
    useEffect(load, [load]);

    if (user === null) return <Spinner />;
    if (user === "error") return <p className="text-error">Пользователь не найден или ошибка загрузки</p>;

    const value = (key: keyof AdminUser) => (key in form ? form[key] : user[key]) as string | null;
    const run = async (action: () => Promise<unknown>, ok: string) => {
        setBusy(true);
        try {
            await action();
            notify(ok, true);
            load();
        } catch (e) {
            notify(e instanceof Error ? e.message : "Ошибка");
        } finally {
            setBusy(false);
            setConfirm(null);
        }
    };
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

    return (
        <div className="max-w-[1100px]">
            <p className="mb-2"><Link href="/admin/users" className="text-primary hover:underline">← Пользователи</Link></p>
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <h1 className="text-[22px] font-bold">{name}</h1>
                {!user.isActive && <span className="rounded-full bg-status-rejected px-2 py-0.5 text-[12px]">заблокирован</span>}
                {user.isDelete && <span className="rounded-full bg-status-rejected px-2 py-0.5 text-[12px]">удалён</span>}
            </div>

            <Panel title="Сведения">
                <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1.5">
                    <dt className="text-muted">Email</dt><dd>{user.email}</dd>
                    <dt className="text-muted">ID</dt><dd className="font-mono text-[12px]">{user.id}</dd>
                    <dt className="text-muted">Создан</dt><dd>{user.created ?? "—"}</dd>
                    <dt className="text-muted">Последний визит</dt><dd>{user.lastVisit ?? "—"}</dd>
                    <dt className="text-muted">Почта подтверждена</dt><dd><YesNo value={user.isVerified} /></dd>
                    <dt className="text-muted">Гудсёрфер</dt><dd><YesNo value={user.isVolunteer} />{user.isVolunteer && <a href={`/volunteers/${user.id}`} className="ml-2 text-primary hover:underline" target="_blank" rel="noreferrer">профиль на сайте</a>}</dd>
                    <dt className="text-muted">Организация</dt><dd><YesNo value={user.isOrganization} /></dd>
                    <dt className="text-muted">Рассылка</dt>
                    <dd>
                        {user.marketingConsent?.consent ? "согласен" : "не согласен"}
                        {user.marketingConsent?.source && <span className="text-muted"> — {SOURCES[user.marketingConsent.source] ?? user.marketingConsent.source}{user.marketingConsent.at ? `, ${isoDate(user.marketingConsent.at)}` : ""}</span>}
                    </dd>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" className={user.isActive ? adminButtonDanger : adminButton} disabled={busy} onClick={() => setConfirm("block")}>{user.isActive ? "Заблокировать" : "Разблокировать"}</button>
                    <button type="button" className={adminButtonDanger} disabled={busy} onClick={() => setConfirm("delete")}>Удалить пользователя</button>
                </div>
            </Panel>

            <Panel title="Данные профиля">
                <form
                    className="grid grid-cols-2 gap-3 down-md:grid-cols-1"
                    onSubmit={(e) => {
                        e.preventDefault();
                        void run(() => api.patch(`user/${id}`, userUpdateBody(user, form)), "Сохранено");
                    }}
                >
                    {TEXT_FIELDS.map(([key, label]) => (
                        <label key={key} className="flex flex-col gap-1 text-[12px] text-muted">
                            {label}
                            <input className={adminInput} value={value(key) ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                        </label>
                    ))}
                    <label className="flex flex-col gap-1 text-[12px] text-muted">
                        Пол
                        <select className={adminInput} value={value("gender") ?? ""} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value || null }))}>
                            <option value="">не указан</option>
                            <option value="male">мужской</option>
                            <option value="female">женский</option>
                            <option value="other">другой</option>
                        </select>
                    </label>
                    <label className="flex flex-col gap-1 text-[12px] text-muted">
                        Язык писем
                        <select className={adminInput} value={value("locale") ?? "ru"} onChange={(e) => setForm((f) => ({ ...f, locale: e.target.value }))}>
                            <option value="ru">русский</option>
                            <option value="en">английский</option>
                            <option value="es">испанский</option>
                        </select>
                    </label>
                    <label className="col-span-2 flex flex-col gap-1 text-[12px] text-muted down-md:col-span-1">
                        О себе
                        <textarea className={`${adminInput} min-h-[100px]`} value={value("aboutMe") ?? ""} onChange={(e) => setForm((f) => ({ ...f, aboutMe: e.target.value }))} />
                    </label>
                    <div className="col-span-2 down-md:col-span-1">
                        <button type="submit" className={adminButtonPrimary} disabled={busy || Object.keys(form).length === 0}>Сохранить</button>
                    </div>
                </form>
            </Panel>

            <MembershipPanel userId={id} isVolunteer={user.isVolunteer} isOrganization={user.isOrganization} notify={notify} onChanged={load} />
            <SkillsPanel user={user} busy={busy} save={(skillIds, achievementIds, additionalSkills) => run(() => api.patch(`user/${id}`, userUpdateBody(user, { skillIds, achievementIds, additionalSkills })), "Навыки и достижения сохранены")} />

            <ConfirmDialog
                open={confirm !== null}
                text={confirm === "delete" ? `Удалить пользователя ${user.email}? Это необратимо.` : user.isActive ? `Заблокировать ${name}? Он не сможет войти.` : `Разблокировать ${name}?`}
                confirm={confirm === "delete" ? "Удалить" : user.isActive ? "Заблокировать" : "Разблокировать"}
                cancel="Отмена"
                busy={busy}
                onConfirm={() => confirm === "delete"
                    ? void run(() => api.del(`user/${id}`), "Пользователь удалён")
                    : void run(() => api.post(`user/${id}/toggle-active`, { isActive: !user.isActive }), user.isActive ? "Заблокирован" : "Разблокирован")}
                onClose={() => setConfirm(null)}
            />
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
        </div>
    );
}

/** Членство: текущее и прошлое, выдача по тарифу/бессрочно/до даты, снятие (AdminUserMembership старой админки) */
function MembershipPanel({ userId, isVolunteer, isOrganization, notify, onChanged }: { userId: string; isVolunteer: boolean; isOrganization: boolean; notify: (t: string, ok?: boolean) => void; onChanged: () => void }) {
    const api = useAdminApi();
    const [data, setData] = useState<{ memberships: Membership[] } | null | "error">(null);
    const [tariffs, setTariffs] = useState<Tariff[]>([]);
    const [tariffCode, setTariffCode] = useState("");
    const [term, setTerm] = useState<"tariff" | "forever" | "date">("tariff");
    const [endDate, setEndDate] = useState("");
    const [comment, setComment] = useState("");
    const [busy, setBusy] = useState(false);
    const [revoke, setRevoke] = useState<Membership | null>(null);

    const load = useCallback(() => {
        api.get<{ memberships: Membership[] }>(`membership/user/${userId}`).then(setData).catch(() => setData("error"));
    }, [api, userId]);
    useEffect(() => {
        load();
        api.get<Tariff[]>("membership/tariffs").then(setTariffs).catch(() => setTariffs([]));
    }, [api, load]);

    const tariff = tariffs.find((t) => t.code === tariffCode);
    const resolvedEnd = term === "forever" ? undefined : term === "date" ? endDate || undefined : tariff ? ymd(tariff.durationDays) : undefined;
    const suitable = tariffs.filter((t) => t.category === "INTERNATIONAL" || (t.forRole === "HOST" ? isOrganization : t.forRole === "VOLUNTEER" ? isVolunteer : true));

    const act = async (action: () => Promise<unknown>, ok: string) => {
        setBusy(true);
        try {
            await action();
            notify(ok, true);
            setComment("");
            load();
            onChanged();
        } catch (e) {
            notify(e instanceof Error ? e.message : "Ошибка");
        } finally {
            setBusy(false);
            setRevoke(null);
        }
    };

    return (
        <Panel title="Членство">
            {data === null && <Spinner />}
            {data === "error" && <p className="text-error">Не удалось загрузить членство</p>}
            {data && data !== "error" && (data.memberships.length === 0 ? <p className="mb-3 text-muted">Членства не было</p> : (
                <div className="mb-4 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="text-[12px] text-muted"><th className="py-1 pr-3">Тариф</th><th className="pr-3">Статус</th><th className="pr-3">Откуда</th><th className="pr-3">Начало</th><th className="pr-3">До</th><th /></tr></thead>
                        <tbody>
                            {data.memberships.map((m) => (
                                <tr key={m.id} className="border-t border-accent-bg/60">
                                    <td className="py-1.5 pr-3">{m.tariffName}{m.privileged && <span className="ml-1 text-[12px] text-muted">(привилегированное)</span>}</td>
                                    <td className="pr-3">{m.active ? "действует" : m.status.toLowerCase()}</td>
                                    <td className="pr-3">{m.source === "ADMIN" ? "выдано админом" : m.source === "PAYMENT" ? "оплата" : m.source.toLowerCase()}</td>
                                    <td className="pr-3">{isoDate(m.startDate)}</td>
                                    <td className="pr-3">{isoDate(m.endDate)}</td>
                                    <td className="text-right">{m.active && <button type="button" className={adminButtonDanger} disabled={busy} onClick={() => setRevoke(m)}>Снять</button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
            <div className="flex flex-wrap items-end gap-3 border-t border-accent-bg pt-3">
                <label className="flex flex-col gap-1 text-[12px] text-muted">
                    Выдать членство
                    <select className={adminInput} value={tariffCode} onChange={(e) => setTariffCode(e.target.value)}>
                        <option value="">тариф…</option>
                        {suitable.map((t) => <option key={t.code} value={t.code}>{t.name}</option>)}
                    </select>
                </label>
                <label className="flex flex-col gap-1 text-[12px] text-muted">
                    Срок
                    <select className={adminInput} value={term} onChange={(e) => setTerm(e.target.value as typeof term)}>
                        <option value="tariff">по тарифу{tariff ? ` (${tariff.durationDays} дн.)` : ""}</option>
                        <option value="forever">бессрочно</option>
                        <option value="date">до даты</option>
                    </select>
                </label>
                {term === "date" && (
                    <label className="flex flex-col gap-1 text-[12px] text-muted">
                        Дата окончания
                        <input type="date" className={adminInput} min={ymd(1)} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </label>
                )}
                <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-[12px] text-muted">
                    Комментарий (в журнал)
                    <input className={adminInput} value={comment} onChange={(e) => setComment(e.target.value)} />
                </label>
                <button
                    type="button"
                    className={adminButtonPrimary}
                    disabled={!tariff || (term === "date" && !endDate) || busy}
                    onClick={() => tariff && void act(() => api.post(`membership/user/${userId}/grant`, { tariffCode: tariff.code, endDate: resolvedEnd, comment: comment.trim() || undefined }), `Членство «${tariff.name}» выдано ${resolvedEnd ? `до ${resolvedEnd.split("-").reverse().join(".")}` : "бессрочно"}`)}
                >
                    Выдать
                </button>
            </div>
            <ConfirmDialog
                open={revoke !== null}
                text={revoke ? `Снять членство «${revoke.tariffName}»?${comment.trim() ? "" : " Комментарий для журнала можно указать в поле выше."}` : ""}
                confirm="Снять"
                cancel="Отмена"
                busy={busy}
                onConfirm={() => revoke && void act(() => api.post(`membership/user/${userId}/revoke`, { category: revoke.category, comment: comment.trim() || undefined }), `Членство «${revoke.tariffName}» снято`)}
                onClose={() => setRevoke(null)}
            />
        </Panel>
    );
}

/** Навыки, дополнительные навыки и достижения (AdminUpdateSkills / AdminUpdateAchievement старой админки) */
function SkillsPanel({ user, busy, save }: { user: AdminUser; busy: boolean; save: (skillIds: number[], achievementIds: number[], additionalSkills: string[]) => Promise<void> }) {
    const api = useAdminApi();
    const [skills, setSkills] = useState<Named[]>([]);
    const [achievements, setAchievements] = useState<Named[]>([]);
    const [selectedSkills, setSelectedSkills] = useState(() => new Set(user.skills.map((s) => s.id)));
    const [selectedAchievements, setSelectedAchievements] = useState(() => new Set(user.achievements.map((a) => a.id)));
    const [extra, setExtra] = useState(user.additionalSkills.join(", "));

    useEffect(() => {
        api.get<AdminPage<Named>>("skill", { page: 1, limit: 500 }).then((r) => setSkills(r.data ?? [])).catch(() => undefined);
        api.get<AdminPage<Named>>("achievement", { page: 1, limit: 500 }).then((r) => setAchievements(r.data ?? [])).catch(() => undefined);
    }, [api]);

    const toggle = (set: Set<number>, update: (s: Set<number>) => void, idValue: number) => {
        const next = new Set(set);
        if (next.has(idValue)) next.delete(idValue);
        else next.add(idValue);
        update(next);
    };

    return (
        <Panel title="Навыки и достижения">
            <p className="mb-1 text-[12px] text-muted">Навыки</p>
            <div className="mb-3 flex flex-wrap gap-2">
                {skills.map((s) => (
                    <label key={s.id} className={`cursor-pointer rounded-full border px-3 py-1 ${selectedSkills.has(s.id) ? "border-primary bg-primary/10" : "border-accent-bg"}`}>
                        <input type="checkbox" className="sr-only" checked={selectedSkills.has(s.id)} onChange={() => toggle(selectedSkills, setSelectedSkills, s.id)} />
                        {s.name}
                    </label>
                ))}
            </div>
            <label className="mb-3 flex flex-col gap-1 text-[12px] text-muted">
                Дополнительные навыки (через запятую)
                <input className={adminInput} value={extra} onChange={(e) => setExtra(e.target.value)} />
            </label>
            <p className="mb-1 text-[12px] text-muted">Достижения</p>
            <div className="mb-3 flex flex-wrap gap-2">
                {achievements.map((a) => (
                    <label key={a.id} className={`cursor-pointer rounded-full border px-3 py-1 ${selectedAchievements.has(a.id) ? "border-primary bg-primary/10" : "border-accent-bg"}`}>
                        <input type="checkbox" className="sr-only" checked={selectedAchievements.has(a.id)} onChange={() => toggle(selectedAchievements, setSelectedAchievements, a.id)} />
                        {a.name}
                    </label>
                ))}
            </div>
            <button type="button" className={adminButtonPrimary} disabled={busy} onClick={() => void save([...selectedSkills], [...selectedAchievements], extra.split(",").map((s) => s.trim()).filter(Boolean))}>Сохранить навыки и достижения</button>
        </Panel>
    );
}
