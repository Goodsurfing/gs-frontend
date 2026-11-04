"use client";

import { AdminForm, type AdminFormConfig } from "@/components/admin/AdminForm";
import { AdminList, type AdminListConfig, YesNo } from "@/components/admin/AdminList";

interface ReviewRow {
    id: string;
    authorFirstName: string | null;
    authorLastName: string | null;
    rating: number;
    description: string | null;
    created: string;
    isFeatured?: boolean;
    vacancyName?: string | null;
    volunteerFirstName?: string | null;
    volunteerLastName?: string | null;
}

const fio = (a?: string | null, b?: string | null) => [a, b].filter(Boolean).join(" ") || "—";
const short = (text: string | null) => (text && text.length > 160 ? `${text.slice(0, 160)}…` : text || "—");

const vacancyReviews: AdminListConfig<ReviewRow> = {
    title: "Отзывы о вакансиях",
    path: "review-vacancy",
    rowKey: (r) => r.id,
    rowHref: (r) => `/admin/reviews/vacancy-personal/${r.id}`,
    filters: [{ key: "vacancyName", label: "Вакансия" }, { key: "authorLastName", label: "Фамилия автора" }, { key: "isFeatured", label: "На главной", options: [{ value: "true", label: "Да" }] }],
    columns: [
        { label: "Вакансия", cell: (r) => r.vacancyName || "—" },
        { label: "Автор", cell: (r) => fio(r.authorFirstName, r.authorLastName) },
        { label: "Оценка", cell: (r) => r.rating },
        { label: "Отзыв", cell: (r) => <p className="max-w-[480px]">{short(r.description)}</p> },
        { label: "Когда", cell: (r) => r.created, className: "whitespace-nowrap" },
        { label: "На главной", cell: (r) => <YesNo value={r.isFeatured} /> },
    ],
    remove: { path: (r) => `review-vacancy/${r.id}`, confirm: () => "Удалить отзыв о вакансии?" },
};

const volunteerReviews: AdminListConfig<ReviewRow> = {
    title: "Отзывы о волонтёрах",
    path: "review-volunteer",
    rowKey: (r) => r.id,
    rowHref: (r) => `/admin/reviews/volunteer-personal/${r.id}`,
    filters: [{ key: "volunteerLastName", label: "Фамилия волонтёра" }, { key: "authorLastName", label: "Автор (организация)" }],
    columns: [
        { label: "Волонтёр", cell: (r) => fio(r.volunteerFirstName, r.volunteerLastName) },
        { label: "Автор", cell: (r) => fio(r.authorFirstName, r.authorLastName) },
        { label: "Оценка", cell: (r) => r.rating },
        { label: "Отзыв", cell: (r) => <p className="max-w-[480px]">{short(r.description)}</p> },
        { label: "Когда", cell: (r) => r.created, className: "whitespace-nowrap" },
    ],
    remove: { path: (r) => `review-volunteer/${r.id}`, confirm: () => "Удалить отзыв о волонтёре?" },
};

/** Отзывы о вакансиях и о волонтёрах — вкладки старой админки, тут одна под другой */
export function ReviewsLists({ kind }: { kind: "vacancy" | "volunteer" }) {
    return <AdminList config={kind === "vacancy" ? vacancyReviews : volunteerReviews} />;
}

const reviewForm = (kind: "vacancy" | "volunteer"): AdminFormConfig => ({
    title: (r) => kind === "vacancy" ? `Отзыв о вакансии «${String(r?.vacancyName ?? "")}»` : `Отзыв о волонтёре ${fio(r?.volunteerFirstName as string, r?.volunteerLastName as string)}`,
    back: { href: kind === "vacancy" ? "/admin/reviews" : "/admin/reviews?tab=volunteer", label: "Отзывы" },
    load: (id) => `review-${kind}/${id}`,
    format: "json",
    fields: [
        { key: "rating", label: "Оценка (1–5)", type: "number", required: true },
        { key: "description", label: "Текст отзыва", type: "textarea", required: true },
        ...(kind === "vacancy" ? [{ key: "isFeatured", label: "Показывать на главной (до 10 отзывов)", type: "checkbox" as const }] : []),
    ],
    create: { method: "POST", path: `review-${kind}` },
    update: (id) => ({ method: "PATCH", path: `review-${kind}/${id}` }),
    // Фото отзыва не правим — отправляем как были
    toBody: (values, record) => ({ ...values, imageIds: ((record?.images as { id: string }[] | undefined) ?? []).map((i) => i.id) }),
});

export function ReviewCard({ kind, id }: { kind: "vacancy" | "volunteer"; id: string }) {
    return <AdminForm config={reviewForm(kind)} id={id} />;
}
