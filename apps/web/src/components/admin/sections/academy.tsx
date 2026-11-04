"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AdminForm, type AdminFormConfig } from "@/components/admin/AdminForm";
import { adminButton, AdminList, type AdminListConfig, YesNo } from "@/components/admin/AdminList";
import { imageFrom, ImageUploadField, type PickedUser, type UploadedImage, userFrom, UserField } from "@/components/admin/fields";
import { type AdminPage, useAdminApi } from "@/lib/admin/api";

/** Академия: курсы, уроки, эксперты, отзывы о курсах. Тексты на сайте выводятся простым текстом (whitespace-pre-line) */

const fio = (a?: { firstName?: string | null; lastName?: string | null } | null) => [a?.firstName, a?.lastName].filter(Boolean).join(" ") || "—";
const imageField = (label = "Обложка", required = true) => ({ key: "image", label, type: "custom" as const, required, wide: true, initial: (r: Record<string, unknown> | null) => imageFrom(r?.image), render: (v: unknown, set: (x: unknown) => void) => <ImageUploadField value={v} onChange={set} /> });

/* ── Курсы ── */

interface CourseRow { id: string; name: string; isActive: boolean; sort: number; takeCourseCount: number; completeCourseCount: number; reviewsCount: number; averageRating: number; author: { firstName: string | null; lastName: string | null } | null }

const coursesList: AdminListConfig<CourseRow> = {
    title: "Курсы",
    path: "course",
    rowKey: (r) => r.id,
    rowHref: (r) => `/admin/courses/${r.id}`,
    createHref: "/admin/courses/create",
    header: <p className="mb-3"><Link href="/admin/courses/experts" className="text-primary hover:underline">Эксперты курсов →</Link></p>,
    filters: [{ key: "name", label: "Название" }],
    columns: [
        { label: "Курс", cell: (r) => r.name },
        { label: "Автор", cell: (r) => fio(r.author) },
        { label: "Начали / прошли", cell: (r) => `${r.takeCourseCount} / ${r.completeCourseCount}`, className: "whitespace-nowrap" },
        { label: "Отзывы (оценка)", cell: (r) => `${r.reviewsCount} (${r.averageRating || "—"})`, className: "whitespace-nowrap" },
        { label: "Порядок", cell: (r) => r.sort, className: "text-right" },
        { label: "Опубликован", cell: (r) => <YesNo value={r.isActive} /> },
    ],
    remove: { path: (r) => `course/delete/${r.id}`, confirm: (r) => `Удалить курс «${r.name}» вместе с уроками?` },
};

/** Эксперты курса: выбор из списка экспертов, порядок — по порядку выбора */
function ExpertsPicker({ value, onChange }: { value: unknown; onChange: (v: { id: string; name: string }[]) => void }) {
    const api = useAdminApi();
    const [all, setAll] = useState<{ id: string; firstName: string; lastName: string; project: string }[] | null>(null);
    useEffect(() => {
        api.get<AdminPage<{ id: string; firstName: string; lastName: string; project: string }>>("expert", { page: 1, limit: 200 }).then((r) => setAll(r.data ?? [])).catch(() => setAll([]));
    }, [api]);
    const selected = Array.isArray(value) ? (value as { id: string; name: string }[]) : [];
    if (all === null) return <span className="text-muted">загрузка…</span>;
    return (
        <div className="flex flex-col gap-2">
            <ol className="list-decimal pl-5">
                {selected.map((e, i) => (
                    <li key={e.id} className="mb-1">
                        {e.name}
                        <button type="button" className="ml-2 cursor-pointer text-[12px] text-primary disabled:opacity-30" disabled={i === 0} onClick={() => onChange(selected.map((x, j) => (j === i - 1 ? selected[i]! : j === i ? selected[i - 1]! : x)))}>↑</button>
                        <button type="button" className="ml-2 cursor-pointer text-[12px] text-error" onClick={() => onChange(selected.filter((x) => x.id !== e.id))}>убрать</button>
                    </li>
                ))}
            </ol>
            <select aria-label="Добавить эксперта" className="max-w-[420px] rounded-[6px] border border-accent-bg bg-surface px-3 py-2 text-ink" value="" onChange={(ev) => {
                const ex = all.find((a) => a.id === ev.target.value);
                if (ex && !selected.some((s) => s.id === ex.id)) onChange([...selected, { id: ex.id, name: `${ex.firstName} ${ex.lastName}` }]);
            }}>
                <option value="">добавить эксперта…</option>
                {all.filter((a) => !selected.some((s) => s.id === a.id)).map((a) => <option key={a.id} value={a.id}>{a.firstName} {a.lastName} — {a.project}</option>)}
            </select>
        </div>
    );
}

/** Уроки курса — под карточкой курса */
function CourseLessons({ courseId }: { courseId: string }) {
    const api = useAdminApi();
    const [lessons, setLessons] = useState<{ id: string; name: string; duration: string | number; averageRating: number }[] | null>(null);
    useEffect(() => {
        api.get<AdminPage<{ id: string; name: string; duration: string | number; averageRating: number }>>(`video-course/list/${courseId}`, { page: 1, limit: 100 }).then((r) => setLessons(r.data ?? [])).catch(() => setLessons([]));
    }, [api, courseId]);
    return (
        <section className="mb-5 rounded-[8px] bg-surface p-4">
            <div className="mb-3 flex items-center gap-3">
                <h2 className="text-[16px] font-bold">Уроки</h2>
                <Link href={`/admin/courses/${courseId}/lessons/create`} className={adminButton}>Добавить урок</Link>
                <a href={`/academy-course/${courseId}`} target="_blank" rel="noreferrer" className="ml-auto text-primary hover:underline">курс на сайте</a>
            </div>
            {lessons === null && <p className="text-muted">загрузка…</p>}
            {lessons?.length === 0 && <p className="text-muted">Уроков нет</p>}
            <ol className="list-decimal pl-5">
                {lessons?.map((l) => (
                    <li key={l.id} className="mb-1"><Link href={`/admin/courses/${courseId}/lessons/${l.id}`} className="text-primary hover:underline">{l.name}</Link> <span className="text-muted">· {l.duration} мин · оценка {l.averageRating || "—"}</span></li>
                ))}
            </ol>
        </section>
    );
}

const courseForm: AdminFormConfig = {
    title: (r) => r ? String(r.name) : "Новый курс",
    back: { href: "/admin/courses", label: "Курсы" },
    load: (id) => `course/${id}`,
    format: "json",
    fields: [
        { key: "name", label: "Название", required: true, wide: true },
        { key: "sort", label: "Порядок (меньше — выше)", type: "number" },
        { key: "isActive", label: "Опубликован", type: "checkbox" },
        { key: "description", label: "О курсе", type: "textarea", required: true },
        { key: "courseFor", label: "Для кого подходит", type: "textarea" },
        { key: "aboutAuthor", label: "Об авторе", type: "textarea" },
        { key: "author", label: "Автор (пользователь)", type: "custom", required: true, initial: (r) => userFrom(r?.author), render: (v, set) => <UserField value={v} onChange={set} /> },
        { key: "experts", label: "Эксперты", type: "custom", wide: true, initial: (r) => ((r?.experts as { id: string; firstName: string; lastName: string }[] | undefined) ?? []).map((e) => ({ id: e.id, name: `${e.firstName} ${e.lastName}` })), render: (v, set) => <ExpertsPicker value={v} onChange={set} /> },
        imageField(),
    ],
    create: { method: "POST", path: "course" },
    update: (id) => ({ method: "PATCH", path: `course/${id}` }),
    toBody: (values) => {
        const { image, author, experts, ...rest } = values as { image?: UploadedImage | null; author?: PickedUser | null; experts?: { id: string }[] } & Record<string, unknown>;
        return { ...rest, imageId: image?.id ?? null, authorId: author?.id ?? null, experts: (experts ?? []).map((e, i) => ({ id: e.id, sort: i })) };
    },
    afterCreate: (res) => ((res as { id?: string } | null)?.id ? `/admin/courses/${(res as { id: string }).id}` : "/admin/courses"),
    extra: (r) => <CourseLessons courseId={String(r.id)} />,
};

/* ── Урок ── */

const lessonForm = (courseId: string): AdminFormConfig => ({
    title: (r) => r ? String(r.name) : "Новый урок",
    back: { href: `/admin/courses/${courseId}`, label: "Курс" },
    load: (id) => `video-course/${id}`,
    format: "json",
    fields: [
        { key: "name", label: "Название", required: true, wide: true },
        { key: "url", label: "Ссылка на видео", required: true, wide: true },
        { key: "duration", label: "Длительность, мин", type: "number", required: true },
        { key: "sort", label: "Порядок", type: "number" },
        { key: "description", label: "Описание", type: "textarea", required: true },
        imageField("Превью"),
    ],
    create: { method: "POST", path: "video-course" },
    update: (id) => ({ method: "PATCH", path: `video-course/${id}` }),
    // Файлы урока не правим — уходят как были
    toBody: (values, record) => {
        const { image, ...rest } = values as { image?: UploadedImage | null } & Record<string, unknown>;
        return { ...rest, courseId, imageId: image?.id ?? null, fileIds: ((record?.files as { id: string }[] | undefined) ?? []).map((f) => f.id) };
    },
    afterCreate: () => `/admin/courses/${courseId}`,
});

/* ── Эксперты ── */

interface ExpertRow { id: string; firstName: string; lastName: string; project: string; country: string | null; city: string | null }

const expertsList: AdminListConfig<ExpertRow> = {
    title: "Эксперты курсов",
    path: "expert",
    rowKey: (r) => r.id,
    rowHref: (r) => `/admin/courses/experts/${r.id}`,
    createHref: "/admin/courses/experts/create",
    filters: [{ key: "lastName", label: "Фамилия" }],
    columns: [
        { label: "Эксперт", cell: (r) => `${r.firstName} ${r.lastName}` },
        { label: "Проект", cell: (r) => r.project },
        { label: "Откуда", cell: (r) => [r.country, r.city].filter(Boolean).join(", ") || "—" },
    ],
    remove: { path: (r) => `expert/${r.id}`, confirm: (r) => `Удалить эксперта ${r.firstName} ${r.lastName}?` },
};

const expertForm: AdminFormConfig = {
    title: (r) => r ? `${String(r.firstName)} ${String(r.lastName)}` : "Новый эксперт",
    back: { href: "/admin/courses/experts", label: "Эксперты" },
    load: (id) => `expert/${id}`,
    format: "json",
    fields: [
        { key: "firstName", label: "Имя", required: true }, { key: "lastName", label: "Фамилия", required: true },
        { key: "project", label: "Проект / должность", required: true, wide: true },
        { key: "country", label: "Страна" }, { key: "city", label: "Город" },
        imageField("Фото", false),
    ],
    create: { method: "POST", path: "expert" },
    update: (id) => ({ method: "PATCH", path: `expert/${id}` }),
    toBody: (values) => {
        const { image, ...rest } = values as { image?: UploadedImage | null } & Record<string, unknown>;
        return { ...rest, imageId: image?.id ?? null };
    },
};

/* ── Отзывы о курсах ── */

interface CourseReviewRow { id: string; rating: number; description: string; isActive: boolean; created: string; author: { firstName: string | null; lastName: string | null } | null; videoCourse: { name: string } | null }

const courseReviewsList: AdminListConfig<CourseReviewRow> = {
    title: "Отзывы о курсах",
    path: "review-video-course",
    rowKey: (r) => r.id,
    rowHref: (r) => `/admin/reviews-courses/${r.id}`,
    columns: [
        { label: "Урок", cell: (r) => r.videoCourse?.name ?? "—" },
        { label: "Автор", cell: (r) => fio(r.author) },
        { label: "Оценка", cell: (r) => r.rating },
        { label: "Отзыв", cell: (r) => r.description },
        { label: "Показан", cell: (r) => <YesNo value={r.isActive} /> },
        { label: "Когда", cell: (r) => r.created, className: "whitespace-nowrap" },
    ],
    remove: { path: (r) => `review-video-course/${r.id}`, confirm: () => "Удалить отзыв?" },
};

const courseReviewForm: AdminFormConfig = {
    title: () => "Отзыв о курсе",
    back: { href: "/admin/reviews-courses", label: "Отзывы о курсах" },
    load: (id) => `review-video-course/${id}`,
    format: "json",
    fields: [
        { key: "rating", label: "Оценка (1–5)", type: "number", required: true },
        { key: "isActive", label: "Показывать", type: "checkbox" },
        { key: "description", label: "Текст", type: "textarea", required: true },
    ],
    create: { method: "POST", path: "review-video-course" },
    update: (id) => ({ method: "PATCH", path: `review-video-course/${id}` }),
};

export function AcademyList({ kind }: { kind: "courses" | "experts" | "reviews" }) {
    const config = { courses: coursesList, experts: expertsList, reviews: courseReviewsList }[kind] as AdminListConfig<unknown>;
    return <AdminList config={config} />;
}

export function AcademyCard({ kind, id, courseId }: { kind: "course" | "lesson" | "expert" | "review"; id: string; courseId?: string }) {
    const config = kind === "course" ? courseForm : kind === "lesson" ? lessonForm(courseId ?? "") : kind === "expert" ? expertForm : courseReviewForm;
    return <AdminForm config={config} id={id} />;
}
