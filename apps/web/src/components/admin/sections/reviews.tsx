"use client";

import { AdminForm, type AdminFormConfig } from "@/components/admin/AdminForm";
import { AdminList, type AdminListConfig, YesNo } from "@/components/admin/AdminList";
import { mediaUrl } from "@/lib/media";

type Photo = { id: string; contentUrl?: string | null; thumbnails?: unknown };

/** Миниатюры фото отзыва в списке: первые две и «+N» */
function PhotoThumbs({ photos }: { photos?: Photo[] }) {
    if (!photos || photos.length === 0) return <span className="text-muted">нет</span>;
    return (
        <span className="flex w-max items-center gap-1 whitespace-nowrap">
            {photos.slice(0, 2).map((photo) => (
                // eslint-disable-next-line @next/next/no-img-element -- превью из хранилища
                <img key={photo.id} src={mediaUrl(photo as never, "small") ?? ""} alt="" loading="lazy" width={40} height={40} className="h-10 w-10 shrink-0 rounded object-cover" />
            ))}
            {photos.length > 2 && <span className="text-[12px] text-muted">+{photos.length - 2}</span>}
        </span>
    );
}

/** Фото в карточке отзыва: крупно, можно убрать отдельное фото (сохранится кнопкой «Сохранить») */
function PhotosEditor({ value, onChange }: { value: unknown; onChange: (photos: Photo[]) => void }) {
    const photos = (Array.isArray(value) ? value : []) as Photo[];
    if (photos.length === 0) return <p className="text-[13px] text-muted">Фото нет. На главной вместо фото будет обложка вакансии.</p>;
    return (
        <div className="flex flex-wrap gap-3">
            {photos.map((photo) => (
                <div key={photo.id} className="relative">
                    <a href={mediaUrl(photo as never) ?? "#"} target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element -- превью из хранилища */}
                        <img src={mediaUrl(photo as never, "medium") ?? ""} alt="" loading="lazy" width={160} height={120} className="h-[120px] w-[160px] rounded object-cover" />
                    </a>
                    <button type="button" title="Убрать фото" aria-label="Убрать фото" onClick={() => onChange(photos.filter((p) => p.id !== photo.id))} className="absolute top-1 right-1 h-6 w-6 cursor-pointer rounded-full bg-white/90 text-[14px] leading-6 shadow">×</button>
                </div>
            ))}
        </div>
    );
}

interface ReviewRow {
    id: string;
    authorFirstName: string | null;
    authorLastName: string | null;
    rating: number;
    description: string | null;
    created: string;
    isFeatured?: boolean;
    images?: Photo[];
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
    filters: [{ key: "vacancyName", label: "Вакансия" }, { key: "authorLastName", label: "Фамилия автора" }, { key: "isFeatured", label: "На главной", options: [{ value: "true", label: "Да" }] }, { key: "hasImages", label: "Фото", options: [{ value: "true", label: "С фото" }, { value: "false", label: "Без фото" }] }],
    columns: [
        { label: "Вакансия", cell: (r) => r.vacancyName || "—" },
        { label: "Фото", cell: (r) => <PhotoThumbs photos={r.images} /> },
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
        { label: "Фото", cell: (r) => <PhotoThumbs photos={r.images} /> },
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
        ...(kind === "vacancy" ? [{ key: "isFeatured", label: "Показывать на главной (до 10 отзывов; без фото — с обложкой вакансии)", type: "checkbox" as const }] : []),
        {
            key: "photos",
            label: "Фото",
            type: "custom" as const,
            wide: true,
            initial: (r: Record<string, unknown> | null) => (r?.images as Photo[] | undefined) ?? [],
            render: (v: unknown, set: (x: unknown) => void) => <PhotosEditor value={v} onChange={set} />,
        },
    ],
    create: { method: "POST", path: `review-${kind}` },
    update: (id) => ({ method: "PATCH", path: `review-${kind}/${id}` }),
    // Фото: оставшиеся после «×» (убранные отвязываются от отзыва)
    toBody: (values, record) => {
        const { photos, ...rest } = values as Record<string, unknown> & { photos?: Photo[] };
        return { ...rest, imageIds: (photos ?? (record?.images as Photo[] | undefined) ?? []).map((i) => i.id) };
    },
});

export function ReviewCard({ kind, id }: { kind: "vacancy" | "volunteer"; id: string }) {
    return <AdminForm config={reviewForm(kind)} id={id} />;
}
