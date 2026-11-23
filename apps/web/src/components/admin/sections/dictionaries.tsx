"use client";

import { AdminForm, type AdminFormConfig } from "@/components/admin/AdminForm";
import { AdminList, type AdminListConfig } from "@/components/admin/AdminList";

/** Запись справочника в API админки: навык, достижение, категория, условия вакансии, категория блога */
interface DictionaryRow {
    id: number;
    name: string;
    nameEn: string | null;
    nameEs: string | null;
    color?: string | null;
    imagePath?: string | null;
    /** Достижения: код значка, который выдаётся сам; null — выдаёт команда */
    code?: string | null;
}

interface Dictionary {
    /** Адрес в API админки */
    api: string;
    /** Список в админке и адрес карточки (как в старой админке) */
    listHref: string;
    cardHref: string;
    title: string;
    one: string;
    color?: boolean;
    image?: boolean;
    /** Достижения: описание «за что» и пометка «выдаётся сам» */
    achievement?: boolean;
    /** multipart (с картинкой) или JSON; обновление — POST /{id} или PATCH /{id} */
    format: "form" | "json";
}

export const DICTIONARIES = {
    skill: { api: "skill", listHref: "/admin/skills-achievements", cardHref: "/admin/skills-achievements/skill-personal", title: "Навыки", one: "навык", image: true, format: "form" },
    achievement: { api: "achievement", listHref: "/admin/skills-achievements", cardHref: "/admin/skills-achievements/achievement-personal", title: "Достижения", one: "достижение", image: true, achievement: true, format: "form" },
    category: { api: "category", listHref: "/admin/categories-vacancies", cardHref: "/admin/categories-vacancies", title: "Категории вакансий", one: "категорию", color: true, image: true, format: "form" },
    house: { api: "house", listHref: "/admin/conditions-vacancies", cardHref: "/admin/conditions-vacancies/house-vacancies-personal", title: "Жильё", one: "вариант жилья", image: true, format: "form" },
    food: { api: "food", listHref: "/admin/conditions-vacancies", cardHref: "/admin/conditions-vacancies/food-vacancies-personal", title: "Питание", one: "вариант питания", image: true, format: "form" },
    transfer: { api: "transfer", listHref: "/admin/conditions-vacancies", cardHref: "/admin/conditions-vacancies/transfer-vacancies-personal", title: "Проезд", one: "вариант проезда", image: true, format: "form" },
    blogCategory: { api: "blog-category", listHref: "/admin/categories-blog", cardHref: "/admin/categories-blog", title: "Категории блога", one: "категорию", color: true, format: "json" },
} satisfies Record<string, Dictionary>;

export type DictionaryKind = keyof typeof DICTIONARIES;

const listConfig = (d: Dictionary): AdminListConfig<DictionaryRow> => ({
    title: d.title,
    path: d.api,
    limit: 200,
    rowKey: (r) => String(r.id),
    rowHref: (r) => `${d.cardHref}/${r.id}`,
    createHref: `${d.cardHref}/create`,
    columns: [
        { label: "Название", cell: (r) => r.name },
        { label: "English", cell: (r) => r.nameEn || "—" },
        { label: "Español", cell: (r) => r.nameEs || "—" },
        ...(d.color ? [{ label: "Цвет", cell: (r: DictionaryRow) => r.color ? <span className="inline-flex items-center gap-2"><span className="size-4 rounded-full border border-accent-bg" style={{ background: r.color }} />{r.color}</span> : "—" }] : []),
        ...(d.achievement ? [{ label: "Выдаётся", cell: (r: DictionaryRow) => r.code && !["pioneer", "recommender", "ambassador", "volunteer_of_month", "international_helper"].includes(r.code) ? "сам (по данным сайта)" : "командой" }] : []),
        // eslint-disable-next-line @next/next/no-img-element -- иконка справочника, размер мал
        ...(d.image ? [{ label: "Картинка", cell: (r: DictionaryRow) => r.imagePath ? <img src={r.imagePath} alt="" loading="lazy" width={32} height={32} className="size-8 object-contain" /> : "—" }] : []),
    ],
    remove: {
        path: (r) => `${d.api}/${r.id}`,
        confirm: (r) => r.code
            ? `«${r.name}» — системный значок: после удаления он заведётся заново и выдастся всем, кому положен (без писем). Удалить?`
            : `Удалить «${r.name}»? Если он используется в вакансиях или профилях, API может отказать.`,
    },
});

const formConfig = (d: Dictionary): AdminFormConfig => ({
    title: (r) => r ? String(r.name ?? "") : `Добавить ${d.one}`,
    back: { href: d.listHref, label: d.title },
    load: (id) => `${d.api}/${id}`,
    format: d.format,
    fields: [
        { key: "name", label: "Название", required: true },
        { key: "nameEn", label: "Название (English)", required: true },
        { key: "nameEs", label: "Название (Español)", required: true },
        ...(d.color ? [{ key: "color", label: "Цвет", type: "color" as const }] : []),
        ...(d.achievement ? [
            { key: "description", label: "За что выдаётся", type: "textarea" as const, hint: "Видно на странице «Все достижения». У значков, которые выдаются сами, описание задаёт сайт — правка перезапишется." },
            { key: "descriptionEn", label: "За что выдаётся (English)", type: "textarea" as const },
        ] : []),
        ...(d.image ? [{ key: "image", label: "Картинка", type: "image" as const, required: true, preview: (r: Record<string, unknown>) => r.imagePath as string | null }] : []),
    ],
    create: { method: "POST", path: d.api },
    update: (id) => ({ method: d.format === "form" ? "POST" : "PATCH", path: `${d.api}/${id}` }),
});

export function DictionaryList({ kind }: { kind: DictionaryKind }) {
    return <AdminList config={listConfig(DICTIONARIES[kind])} />;
}

export function DictionaryCard({ kind, id }: { kind: DictionaryKind; id: string }) {
    return <AdminForm config={formConfig(DICTIONARIES[kind])} id={id} />;
}
