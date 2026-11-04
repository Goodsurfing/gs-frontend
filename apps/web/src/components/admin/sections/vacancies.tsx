"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { adminButton, adminButtonPrimary, adminInput, AdminList, type AdminListConfig } from "@/components/admin/AdminList";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { type AdminPage, useAdminApi } from "@/lib/admin/api";

/** Строка списка вакансий (/admin/v1/vacancy) */
interface VacancyRow {
    id: number;
    name: string | null;
    status: string;
    organizationName: string | null;
    user: { id: string; firstName: string | null; lastName: string | null } | null;
    categories: { name: string }[];
    countApplication: number;
    countAcceptApplication: number;
    countCanselApplication: number;
    isFeatured: boolean;
}

/** На главной показываются первые 10 отмеченных (OffersSlider) — больше отмечать нет смысла */
export const MAX_FEATURED_OFFERS = 10;

const STATUS: Record<string, string> = { active: "опубликована", disabled: "снята", draft: "черновик", deleted: "удалена" };

const listConfig = (featuredTotal: number | null, refreshFeatured: () => void): AdminListConfig<VacancyRow> => ({
    title: "Вакансии",
    path: "vacancy",
    rowKey: (r) => String(r.id),
    rowHref: (r) => `/admin/vacancy/${r.id}`,
    // Сортировки списка вакансий в API — с префиксом сущности (AdminSort старой админки)
    defaultSort: "vacancy.id:desc",
    sorts: [
        { value: "vacancy.id:desc", label: "Новые сначала" }, { value: "vacancy.id:asc", label: "Старые сначала" },
        { value: "vacancy.name:asc", label: "Название ↑" }, { value: "organization.name:asc", label: "Организация ↑" },
        { value: "countApplication:desc", label: "Больше заявок" }, { value: "vacancy.status:asc", label: "По статусу" },
    ],
    filters: [
        { key: "vacancyName", label: "Название" },
        { key: "organizationName", label: "Организация" },
        { key: "isFeatured", label: "На главной", options: [{ value: "true", label: "Да" }] },
    ],
    header: featuredTotal !== null ? <p className="mb-3 text-muted">На главной отмечено {featuredTotal} из {MAX_FEATURED_OFFERS}.</p> : null,
    columns: [
        { label: "Вакансия", cell: (r) => <span>{r.name || `#${r.id}`}<span className="block text-[12px] text-muted">#{r.id} · {r.categories.map((c) => c.name).join(", ") || "без категории"}</span></span> },
        { label: "Организация", cell: (r) => <span>{r.organizationName || "—"}<span className="block text-[12px] text-muted">{[r.user?.firstName, r.user?.lastName].filter(Boolean).join(" ")}</span></span> },
        { label: "Статус", cell: (r) => STATUS[r.status] ?? r.status },
        { label: "Заявки (приняты / отклонены)", cell: (r) => `${r.countApplication} (${r.countAcceptApplication} / ${r.countCanselApplication})`, className: "whitespace-nowrap" },
    ],
    actions: (r, { api, reload, notify }) => (
        <>
            <a href={`/offers/${r.id}`} target="_blank" rel="noreferrer" className={adminButton}>На сайте</a>
            <button
                type="button"
                className={adminButton}
                title={r.isFeatured ? "Убрать с главной" : "Показать на главной"}
                disabled={!r.isFeatured && featuredTotal !== null && featuredTotal >= MAX_FEATURED_OFFERS}
                onClick={() => void api.patch(`vacancy/${r.id}/toggle-featured`, { isFeatured: !r.isFeatured })
                    .then(() => {
                        notify(r.isFeatured ? "Убрана с главной" : "Показывается на главной", true);
                        reload();
                        refreshFeatured();
                    })
                    .catch((e: unknown) => notify(e instanceof Error ? e.message : "Ошибка"))}
            >
                {r.isFeatured ? "★ на главной" : "☆ на главную"}
            </button>
            {(r.status === "active" || r.status === "disabled") && (
                <button
                    type="button"
                    className={adminButton}
                    // disabled, а не draft: в черновик бэкенд не переводит вакансии с заявками
                    onClick={() => void api.patch(`vacancy/${r.id}/toggle-status`, { status: r.status === "active" ? "disabled" : "active" })
                        .then(() => {
                            notify(r.status === "active" ? "Снята с публикации" : "Опубликована", true);
                            reload();
                        })
                        .catch((e: unknown) => notify(e instanceof Error ? e.message : "Ошибка"))}
                >
                    {r.status === "active" ? "Снять" : "Опубликовать"}
                </button>
            )}
        </>
    ),
    remove: { path: (r) => `vacancy/${r.id}`, confirm: (r) => `Удалить вакансию «${r.name ?? r.id}»?` },
});

export function VacanciesList() {
    const api = useAdminApi();
    const [featured, setFeatured] = useState<number | null>(null);
    const refresh = useCallback(() => {
        api.get<AdminPage<unknown>>("vacancy", { isFeatured: true, page: 1, limit: 1 }).then((r) => setFeatured(r.pagination?.total ?? null)).catch(() => setFeatured(null));
    }, [api]);
    useEffect(refresh, [refresh]);
    return <AdminList config={listConfig(featured, refresh)} />;
}

/* ── Правка вакансии по шагам (AdminOffer* старой админки) ── */

type Dict = "category" | "skill" | "food" | "house" | "transfer";

interface StepField {
    key: string;
    label: string;
    kind: "text" | "textarea" | "number" | "bool" | "select" | "multi" | "dict" | "list" | "lines" | "periods";
    options?: { value: string; label: string }[];
    dict?: Dict;
    hint?: string;
}

interface Step {
    key: string;
    label: string;
    path: string;
    fields: StepField[];
    /** GET → тело PATCH: что API не принимает обратно */
    toBody?: (data: Record<string, unknown>) => Record<string, unknown>;
}

const opts = (pairs: [string, string][]) => pairs.map(([value, label]) => ({ value, label }));

const STEPS: Step[] = [
    {
        key: "description", label: "Описание", path: "description",
        fields: [
            { key: "title", label: "Название", kind: "text" },
            { key: "shortDescription", label: "Кратко", kind: "textarea" },
            { key: "description", label: "Описание", kind: "textarea" },
            { key: "categoryIds", label: "Категории", kind: "dict", dict: "category" },
        ],
        // Обложка и галерея — без правки, отправляем текущую обложку
        toBody: (data) => {
            const { image, ...rest } = data;
            delete rest.galleryImages;
            return { ...rest, imageId: (image as { id?: string } | null)?.id ?? null };
        },
    },
    {
        key: "address", label: "Где", path: "address",
        fields: [
            { key: "address", label: "Адрес", kind: "text" },
            { key: "latitude", label: "Широта", kind: "number" },
            { key: "longitude", label: "Долгота", kind: "number", hint: "Координаты точки на карте вакансий" },
        ],
    },
    {
        key: "when", label: "Когда", path: "when",
        fields: [
            { key: "periods", label: "Периоды", kind: "periods" },
            { key: "isFullYearAcceptable", label: "Круглый год", kind: "bool" },
            { key: "durationMinDays", label: "Минимум дней", kind: "number" },
            { key: "durationMaxDays", label: "Максимум дней", kind: "number" },
            { key: "applicationEndDate", label: "Приём заявок до (дд.мм.гггг)", kind: "text" },
            { key: "isApplicableAtTheEnd", label: "Можно подать до конца периода", kind: "bool" },
        ],
    },
    {
        key: "who-needs", label: "Кто нужен", path: "who-needs",
        fields: [
            { key: "gender", label: "Пол", kind: "multi", options: opts([["male", "мужчины"], ["female", "женщины"], ["other", "другое"]]) },
            { key: "ageMin", label: "Возраст от", kind: "number" },
            { key: "ageMax", label: "Возраст до", kind: "number" },
            { key: "volunteerPlaceCount", label: "Мест", kind: "number" },
            { key: "receptionPlace", label: "Кого принимают", kind: "select", options: opts([["any", "всех"], ["foreigners", "иностранцев"], ["compatriot", "соотечественников"]]) },
            { key: "needAllLanguages", label: "Нужны все языки из списка", kind: "bool", hint: "Сами языки правятся в мастере вакансии и сохраняются как есть" },
            { key: "additionalInfo", label: "Дополнительно", kind: "textarea" },
        ],
    },
    {
        key: "what-to-do", label: "Чем заниматься", path: "what-to-do",
        fields: [
            { key: "skillIds", label: "Навыки", kind: "dict", dict: "skill" },
            { key: "additionalSkills", label: "Дополнительные навыки", kind: "list" },
            { key: "hour", label: "Часов", kind: "number" },
            { key: "timeType", label: "В", kind: "select", options: opts([["day", "день"], ["week", "неделю"], ["month", "месяц"]]) },
            { key: "dayOff", label: "Выходных в неделю", kind: "number" },
            { key: "externalInfo", label: "Подробнее", kind: "textarea" },
        ],
        // GET отдаёт hour, PATCH ждёт hours
        toBody: ({ hour, ...rest }) => ({ ...rest, hours: hour }),
    },
    {
        key: "condition", label: "Условия", path: "condition",
        fields: [
            { key: "houseIds", label: "Жильё", kind: "dict", dict: "house" },
            { key: "foodIds", label: "Питание", kind: "dict", dict: "food" },
            { key: "transferIds", label: "Проезд", kind: "dict", dict: "transfer" },
            { key: "conveniences", label: "Удобства", kind: "multi", options: opts([["hot-water", "горячая вода"], ["wi-fi", "Wi-Fi"], ["electricity", "электричество"], ["conditioner", "кондиционер"], ["bath", "баня/душ"]]) },
            { key: "additionalFeatures", label: "Дополнительно", kind: "multi", options: opts([["master_class", "мастер-классы"], ["excursions", "экскурсии"], ["horses", "лошади"], ["languages", "языки"], ["additional", "другое"]]) },
            { key: "volunteerContributions", label: "Взнос волонтёра", kind: "number" },
            { key: "volunteerRemuneration", label: "Вознаграждение волонтёру", kind: "number" },
            { key: "currency", label: "Валюта", kind: "select", options: opts([["RUB", "₽"], ["EUR", "€"], ["USD", "$"]]) },
            { key: "additionalConditions", label: "Дополнительные условия", kind: "textarea" },
        ],
    },
    {
        key: "finishing-touches", label: "Последние штрихи", path: "finishing-touches",
        fields: [
            { key: "additionalConditions", label: "Кого рады видеть", kind: "multi", options: opts([["allow-kids", "можно с детьми"], ["allow-pets", "можно с животными"], ["couples", "пары"], ["students", "студенты"], ["vegetarian", "вегетарианцы"], ["adult-only", "только 18+"]]) },
            { key: "onlyVerified", label: "Только подтверждённые волонтёры", kind: "bool" },
            { key: "helloText", label: "Приветствие", kind: "textarea" },
            { key: "roles", label: "Правила", kind: "textarea" },
            { key: "questionnaireUrl", label: "Ссылка на анкету", kind: "text" },
            { key: "questions", label: "Вопросы волонтёру (по одному в строке)", kind: "lines" },
        ],
        toBody: (data) => {
            const rest = { ...data };
            delete rest.status;
            return rest;
        },
    },
];

type Data = Record<string, unknown>;

function StepEditor({ vacancyId, step }: { vacancyId: string; step: Step }) {
    const api = useAdminApi();
    const [data, setData] = useState<Data | null | "error">(null);
    const [dicts, setDicts] = useState<Partial<Record<Dict, { id: number; name: string }[]>>>({});
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    useEffect(() => {
        let cancelled = false;
        api.get<Data>(`vacancy/${step.path}/${vacancyId}`).then((d) => !cancelled && setData(d)).catch(() => !cancelled && setData("error"));
        for (const dict of new Set(step.fields.map((f) => f.dict).filter((d): d is Dict => !!d))) {
            api.get<AdminPage<{ id: number; name: string }>>(dict, { page: 1, limit: 200 })
                .then((r) => !cancelled && setDicts((prev) => ({ ...prev, [dict]: r.data ?? [] })))
                .catch(() => undefined);
        }
        return () => {
            cancelled = true;
        };
    }, [api, step, vacancyId]);

    if (data === null) return <Spinner />;
    if (data === "error") return <p className="text-error">Не удалось загрузить шаг</p>;

    const set = (key: string, value: unknown) => setData({ ...data, [key]: value });
    const toggleIn = (key: string, value: string | number) => {
        const list = Array.isArray(data[key]) ? (data[key] as (string | number)[]) : [];
        set(key, list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    };

    const save = async () => {
        setBusy(true);
        try {
            const rest: Data = { ...data };
            delete rest.id;
            // Текст без значения — пустая строка: API отвечает «should not be null» (так же шлёт мастер вакансии)
            for (const f of step.fields) {
                if ((f.kind === "text" || f.kind === "textarea") && (rest[f.key] === null || rest[f.key] === undefined)) rest[f.key] = "";
            }
            await api.patch(`vacancy/${step.path}/${vacancyId}`, step.toBody ? step.toBody(rest) : rest);
            setToast({ text: "Сохранено", ok: true });
        } catch (e) {
            const message = e instanceof Error ? step.fields.reduce((text, f) => text.replaceAll(`${f.key}:`, `${f.label}:`), e.message) : "Не удалось сохранить";
            setToast({ text: message, ok: false });
        } finally {
            setBusy(false);
        }
    };

    return (
        <form
            className="flex flex-col gap-4 rounded-[8px] bg-surface p-4"
            onSubmit={(e) => {
                e.preventDefault();
                void save();
            }}
        >
            {step.fields.map((f) => {
                const value = data[f.key];
                const label = <span className="text-[12px] text-muted">{f.label}</span>;
                const hint = f.hint ? <span className="text-[11px] text-muted">{f.hint}</span> : null;
                switch (f.kind) {
                    case "bool":
                        return <label key={f.key} className="flex items-center gap-2"><input type="checkbox" checked={value === true} onChange={(e) => set(f.key, e.target.checked)} />{f.label}{hint}</label>;
                    case "textarea":
                        return <label key={f.key} className="flex flex-col gap-1">{label}<textarea className={`${adminInput} min-h-[110px]`} value={String(value ?? "")} onChange={(e) => set(f.key, e.target.value)} />{hint}</label>;
                    case "number":
                        return <label key={f.key} className="flex max-w-[260px] flex-col gap-1">{label}<input type="number" step="any" className={adminInput} value={value === null || value === undefined ? "" : String(value)} onChange={(e) => set(f.key, e.target.value === "" ? null : Number(e.target.value))} />{hint}</label>;
                    case "select":
                        return (
                            <label key={f.key} className="flex max-w-[320px] flex-col gap-1">{label}
                                <select className={adminInput} value={String(value ?? "")} onChange={(e) => set(f.key, e.target.value || null)}>
                                    <option value="">—</option>
                                    {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </label>
                        );
                    case "multi":
                    case "dict": {
                        const items = f.kind === "dict" ? (dicts[f.dict!] ?? []).map((d) => ({ value: d.id as string | number, label: d.name })) : (f.options ?? []).map((o) => ({ value: o.value as string | number, label: o.label }));
                        const selected = Array.isArray(value) ? (value as (string | number)[]) : [];
                        return (
                            <fieldset key={f.key} className="flex flex-col gap-1">
                                <legend className="mb-1 text-[12px] text-muted">{f.label}</legend>
                                <div className="flex flex-wrap gap-2">
                                    {items.map((item) => (
                                        <label key={String(item.value)} className={`cursor-pointer rounded-full border px-3 py-1 ${selected.includes(item.value) ? "border-primary bg-primary/10" : "border-accent-bg"}`}>
                                            <input type="checkbox" className="sr-only" checked={selected.includes(item.value)} onChange={() => toggleIn(f.key, item.value)} />
                                            {item.label}
                                        </label>
                                    ))}
                                    {f.kind === "dict" && items.length === 0 && <span className="text-muted">загрузка…</span>}
                                </div>
                            </fieldset>
                        );
                    }
                    case "list":
                        return <label key={f.key} className="flex flex-col gap-1">{label}<input className={adminInput} value={Array.isArray(value) ? (value as string[]).join(", ") : ""} onChange={(e) => set(f.key, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /><span className="text-[11px] text-muted">через запятую</span></label>;
                    case "lines":
                        return <label key={f.key} className="flex flex-col gap-1">{label}<textarea className={`${adminInput} min-h-[90px]`} value={Array.isArray(value) ? (value as string[]).join("\n") : ""} onChange={(e) => set(f.key, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} /></label>;
                    case "periods": {
                        const periods = Array.isArray(value) ? (value as { id: number | null; start: string | null; end: string | null }[]) : [];
                        const update = (i: number, patch: Partial<{ start: string; end: string }>) => set(f.key, periods.map((p, j) => (j === i ? { ...p, ...patch } : p)));
                        return (
                            <fieldset key={f.key} className="flex flex-col gap-2">
                                <legend className="mb-1 text-[12px] text-muted">{f.label} (дд.мм.гггг)</legend>
                                {periods.map((p, i) => (
                                    <div key={p.id ?? `new-${i}`} className="flex flex-wrap items-center gap-2">
                                        <input aria-label={`Начало периода ${i + 1}`} className={`${adminInput} max-w-[150px]`} value={p.start ?? ""} onChange={(e) => update(i, { start: e.target.value })} />
                                        —
                                        <input aria-label={`Конец периода ${i + 1}`} className={`${adminInput} max-w-[150px]`} value={p.end ?? ""} onChange={(e) => update(i, { end: e.target.value })} />
                                        <button type="button" className={adminButton} onClick={() => set(f.key, periods.filter((_, j) => j !== i))}>Убрать</button>
                                    </div>
                                ))}
                                <button type="button" className={`${adminButton} self-start`} onClick={() => set(f.key, [...periods, { id: null, start: "", end: "" }])}>Добавить период</button>
                            </fieldset>
                        );
                    }
                    default:
                        return <label key={f.key} className="flex flex-col gap-1">{label}<input className={adminInput} value={String(value ?? "")} onChange={(e) => set(f.key, e.target.value)} />{hint}</label>;
                }
            })}
            <div><button type="submit" className={adminButtonPrimary} disabled={busy}>Сохранить шаг «{step.label}»</button></div>
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
        </form>
    );
}

/** Правка вакансии администратором: шаги мастера на вкладках, каждый сохраняется отдельно (как в старой админке) */
export function VacancyEditor({ id }: { id: string }) {
    const [tab, setTab] = useState(STEPS[0]!.key);
    const step = STEPS.find((s) => s.key === tab) ?? STEPS[0]!;
    return (
        <div className="max-w-[1000px]">
            <p className="mb-2"><Link href="/admin/vacancies" className="text-primary hover:underline">← Вакансии</Link></p>
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <h1 className="text-[22px] font-bold">Вакансия #{id}</h1>
                <a href={`/offers/${id}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">открыть на сайте</a>
            </div>
            <div role="tablist" aria-label="Шаги вакансии" className="mb-4 flex flex-wrap gap-1">
                {STEPS.map((s) => (
                    <button key={s.key} type="button" role="tab" aria-selected={s.key === tab} className={`cursor-pointer rounded-[6px] px-3 py-1.5 ${s.key === tab ? "bg-primary text-white" : "bg-surface hover:bg-field"}`} onClick={() => setTab(s.key)}>
                        {s.label}
                    </button>
                ))}
            </div>
            <StepEditor key={step.key} vacancyId={id} step={step} />
        </div>
    );
}
