"use client";

import { useCallback, useEffect, useState } from "react";

import { adminButton, AdminList, type AdminListConfig } from "@/components/admin/AdminList";
import { opts, type Step, StepsEditor } from "@/components/admin/StepsEditor";
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

/** Правка вакансии администратором: шаги мастера на вкладках, каждый сохраняется отдельно (как в старой админке) */
export function VacancyEditor({ id }: { id: string }) {
    return <StepsEditor base="vacancy" id={id} steps={STEPS} title={`Вакансия #${id}`} back={{ href: "/admin/vacancies", label: "Вакансии" }} siteHref={`/offers/${id}`} />;
}
