"use client";

import { adminButton, adminButtonDanger, AdminList, type AdminListConfig } from "@/components/admin/AdminList";
import { type Step, StepsEditor } from "@/components/admin/StepsEditor";
import { API_URL } from "@/lib/browserApi";

/** Сборы (fundraise): список, закрытие, удаление, правка по шагам мастера сбора */

interface FundraiseRow {
    id: string;
    name: string | null;
    endDate: string | null;
    isUntilAmountCollected: boolean;
    amount: number;
    minAmount: number;
    countParticipants: number;
    amountCollected: number;
    amountCollectedPercent: number;
    status: string;
    author: { id: string; firstName: string | null; lastName: string | null } | null;
    categories: { name: string }[];
}

const STATUS: Record<string, string> = { active: "идёт", close: "закрыт", draft: "черновик", disabled: "снят" };
const rub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

const listConfig: AdminListConfig<FundraiseRow> = {
    title: "Сборы",
    path: "fundraise/",
    rowKey: (r) => r.id,
    rowHref: (r) => `/admin/donations/${r.id}`,
    filters: [{ key: "name", label: "Название" }, { key: "authorLastName", label: "Фамилия автора" }],
    columns: [
        { label: "Сбор", cell: (r) => r.name || <span className="text-muted">без названия</span> },
        { label: "Автор", cell: (r) => [r.author?.firstName, r.author?.lastName].filter(Boolean).join(" ") || "—" },
        { label: "Собрано", cell: (r) => <span>{rub(r.amountCollected)} из {rub(r.amount)}<span className="block text-[12px] text-muted">{r.amountCollectedPercent}% · {r.countParticipants} чел.</span></span>, className: "whitespace-nowrap" },
        { label: "До", cell: (r) => r.isUntilAmountCollected ? "пока не соберут" : r.endDate ?? "—", className: "whitespace-nowrap" },
        { label: "Статус", cell: (r) => STATUS[r.status] ?? r.status },
    ],
    actions: (r, { api, reload, notify }) => (
        <>
            {r.status !== "draft" && <a href={`/fundraise/${r.id}`} target="_blank" rel="noreferrer" className={adminButton}>На сайте</a>}
            {r.status === "active" && (
                <button
                    type="button"
                    className={adminButtonDanger}
                    onClick={() => {
                        // Закрытие ручное и необратимое (решение 30.10: пожертвования — только в активный сбор)
                        if (!window.confirm(`Закрыть сбор «${r.name ?? r.id}»? Пожертвования в него прекратятся, открыть снова нельзя.`)) return;
                        void api.patch(`fundraise/${r.id}/toggle-status`, { status: "close" })
                            .then(() => {
                                notify("Сбор закрыт", true);
                                reload();
                            })
                            .catch((e: unknown) => notify(e instanceof Error ? e.message : "Ошибка"));
                    }}
                >
                    Закрыть сбор
                </button>
            )}
        </>
    ),
    remove: { path: (r) => `fundraise/${r.id}`, confirm: (r) => `Удалить сбор «${r.name ?? r.id}»?` },
};

export function FundraisesList() {
    return <AdminList config={listConfig} />;
}

const STEPS: Step[] = [
    {
        key: "description", label: "Описание", path: "description",
        fields: [
            { key: "name", label: "Название", kind: "text" },
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
    { key: "address", label: "Где", path: "address", fields: [{ key: "address", label: "Адрес", kind: "text" }, { key: "latitude", label: "Широта", kind: "number" }, { key: "longitude", label: "Долгота", kind: "number" }] },
    { key: "when", label: "Когда", path: "when", fields: [{ key: "endDate", label: "Дата окончания (дд.мм.гггг)", kind: "text" }, { key: "isUntilAmountCollected", label: "Пока не соберут нужную сумму", kind: "bool" }] },
    { key: "how-many", label: "Сколько", path: "how-many", fields: [{ key: "amount", label: "Нужная сумма, ₽", kind: "number" }, { key: "minAmount", label: "Минимальное пожертвование, ₽", kind: "number" }] },
    {
        key: "automatic-messages", label: "Автосообщения", path: "automatic-messages",
        fields: [{ key: "wordsGratitude", label: "Слова благодарности донору", kind: "textarea" }, { key: "urlProgressWork", label: "Ссылки на ход работ (по одной в строке)", kind: "lines" }],
        // PATCH этого шага требует статус (им мастер сбора публикует), а GET его не отдаёт — берём текущий с публичной карточки, чтобы не менять
        prepare: async (id) => {
            const response = await fetch(`${API_URL}/api/v1/fundraise/${encodeURIComponent(id)}?lang=ru`, { signal: AbortSignal.timeout(10_000) });
            const data = (await response.json().catch(() => null)) as { status?: string } | null;
            if (!data?.status) throw new Error("Не удалось узнать статус сбора — сохранение отменено");
            return { status: data.status };
        },
    },
];

export function FundraiseEditor({ id }: { id: string }) {
    return <StepsEditor base="fundraise" id={id} steps={STEPS} title="Сбор" back={{ href: "/admin/donations", label: "Сборы" }} siteHref={`/fundraise/${id}`} />;
}
