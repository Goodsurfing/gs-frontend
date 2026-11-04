"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/Spinner";
import { useAdminApi } from "@/lib/admin/api";

/** Ответ GET /admin/v1/dashboard (gs-backend AdminDashboard) */
interface Dashboard {
    users: { total: number; new7: number; new30: number };
    applications: { new7: number; new30: number; waiting: number; answeredShare30: number | null; acceptedShare30: number | null };
    vacancies: { active: number; draft: number };
    memberships: { activeRegular: number; activeInternational: number; endingIn30: number };
    payments30: Record<"MEMBERSHIP" | "DONATION", { count: number; amount: number }>;
    feedbackNew: number;
    weekly: { week: string; users: number; applications: number; payments: number }[];
}

const num = (n: number) => n.toLocaleString("ru-RU");
const pct = (n: number | null) => (n === null ? "—" : `${Math.round(n * 100)} %`);
const rub = (n: number) => `${Math.round(n).toLocaleString("ru-RU")} ₽`;
const weekLabel = (ymd: string) => ymd.slice(8, 10) + "." + ymd.slice(5, 7);

function Tile({ label, value, note, href }: { label: string; value: string; note?: string; href?: string }) {
    const body = (
        <>
            <p className="text-[12px] text-muted">{label}</p>
            <p className="mt-1 text-[24px] font-bold">{value}</p>
            {note && <p className="text-[12px] text-muted">{note}</p>}
        </>
    );
    return href ? <Link href={href} className="rounded-[8px] bg-surface p-4 hover:shadow-md">{body}</Link> : <div className="rounded-[8px] bg-surface p-4">{body}</div>;
}

/** Недельный ряд одной величины: столбцы от нуля, подпись последней недели и максимума, подсказка при наведении */
function WeeklyBars({ title, data }: { title: string; data: { week: string; value: number }[] }) {
    const [hover, setHover] = useState<number | null>(null);
    const max = Math.max(1, ...data.map((d) => d.value));
    const H = 120;
    const last = data.at(-1);
    return (
        <figure className="rounded-[8px] bg-surface p-4">
            <figcaption className="mb-3">
                <span className="block font-semibold">{title} по неделям</span>
                <span className="block text-[12px] text-muted">эта неделя: {last ? num(last.value) : "—"} · максимум: {num(max)}</span>
            </figcaption>
            <div className="relative" onMouseLeave={() => setHover(null)}>
                <div className="flex items-end gap-[2px]" style={{ height: H }} role="img" aria-label={`${title} по неделям: ${data.map((d) => `${weekLabel(d.week)} — ${d.value}`).join(", ")}`}>
                    {data.map((d, i) => (
                        // Зона наведения во всю высоту — больше самого столбца
                        <div key={d.week} className="flex h-full flex-1 cursor-default items-end" onMouseEnter={() => setHover(i)}>
                            <div className={`w-full rounded-t-[4px] ${hover === i ? "bg-ink" : "bg-primary-hover"}`} style={{ height: Math.max(2, Math.round((d.value / max) * H)) }} />
                        </div>
                    ))}
                </div>
                {hover !== null && data[hover] && (
                    <div className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-[6px] bg-ink px-2 py-1 text-[12px] whitespace-nowrap text-white" style={{ left: `${((hover + 0.5) / data.length) * 100}%` }}>
                        неделя с {weekLabel(data[hover].week)}: <b>{num(data[hover].value)}</b>
                    </div>
                )}
                <div className="mt-1 flex justify-between text-[11px] text-muted"><span>{data[0] ? weekLabel(data[0].week) : ""}</span><span>{last ? weekLabel(last.week) : ""}</span></div>
            </div>
        </figure>
    );
}

/** Сводка с бэкенда: показатели за 7/30 дней и недельные ряды. Нет эндпоинта (старый бэкенд) — блока нет */
export function DashboardStats() {
    const api = useAdminApi();
    const [data, setData] = useState<Dashboard | null | "none">(null);
    useEffect(() => {
        api.get<Dashboard>("dashboard").then(setData).catch(() => setData("none"));
    }, [api]);
    if (data === "none") return null;
    if (data === null) return <div className="mb-8"><Spinner /></div>;
    const m = data.payments30.MEMBERSHIP;
    const d = data.payments30.DONATION;
    return (
        <div className="mb-8">
            <div className="mb-4 grid grid-cols-4 gap-3 down-lg:grid-cols-2">
                <Tile label="Регистрации за 7 дней" value={num(data.users.new7)} note={`за 30 дней — ${num(data.users.new30)}, всего ${num(data.users.total)}`} href="/admin/users" />
                <Tile label="Отклики за 7 дней" value={num(data.applications.new7)} note={`за 30 дней — ${num(data.applications.new30)}, ждут ответа ${num(data.applications.waiting)}`} />
                <Tile label="Организаторы ответили" value={pct(data.applications.answeredShare30)} note={`приняли ${pct(data.applications.acceptedShare30)} · отклики 2–30 дней`} />
                <Tile label="Активные вакансии" value={num(data.vacancies.active)} note={`черновиков ${num(data.vacancies.draft)}`} href="/admin/vacancies" />
                <Tile label="Действующее членство" value={num(data.memberships.activeRegular)} note={`международное ${num(data.memberships.activeInternational)} · истекает за 30 дней ${num(data.memberships.endingIn30)}`} href="/admin/users?membershipStatus=active" />
                <Tile label="Оплаты членства за 30 дней" value={rub(m.amount)} note={`${num(m.count)} оплат`} />
                <Tile label="Пожертвования за 30 дней" value={rub(d.amount)} note={`${num(d.count)} пожертвований`} href="/admin/donations" />
                <Tile label="Новые обращения" value={num(data.feedbackNew)} href="/admin/feedback?status=NEW" />
            </div>
            <div className="grid grid-cols-3 gap-3 down-lg:grid-cols-1">
                <WeeklyBars title="Регистрации" data={data.weekly.map((w) => ({ week: w.week, value: w.users }))} />
                <WeeklyBars title="Отклики" data={data.weekly.map((w) => ({ week: w.week, value: w.applications }))} />
                <WeeklyBars title="Успешные оплаты" data={data.weekly.map((w) => ({ week: w.week, value: w.payments }))} />
            </div>
            <details className="mt-2 rounded-[8px] bg-surface p-3">
                <summary className="cursor-pointer text-primary">Таблица по неделям</summary>
                <table className="mt-2 w-full text-left">
                    <thead><tr className="text-[12px] text-muted"><th className="py-1">Неделя с</th><th>Регистрации</th><th>Отклики</th><th>Оплаты</th></tr></thead>
                    <tbody>{data.weekly.map((w) => <tr key={w.week} className="border-t border-accent-bg/60"><td className="py-1">{weekLabel(w.week)}</td><td>{num(w.users)}</td><td>{num(w.applications)}</td><td>{num(w.payments)}</td></tr>)}</tbody>
                </table>
            </details>
        </div>
    );
}
