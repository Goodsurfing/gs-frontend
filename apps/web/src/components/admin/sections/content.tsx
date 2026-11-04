"use client";

import { AdminForm, type AdminField, type AdminFormConfig } from "@/components/admin/AdminForm";
import { AdminList, type AdminListConfig, YesNo } from "@/components/admin/AdminList";
import { DictField, HtmlField, imageFrom, ImageUploadField, type PickedUser, type UploadedImage, userFrom, UserField } from "@/components/admin/fields";

/** Материалы «Сообщества»: новости, блог, журналы, видео и комментарии к ним */

export type ContentKind = "news" | "blog" | "journal" | "video";

interface ContentRow {
    id: string | number;
    name: string | null;
    categoryName?: string | null;
    isActive: boolean;
    created: string;
    reviewCount: number;
    author?: { firstName: string | null; lastName: string | null } | null;
}

interface Kind {
    api: string;
    href: string;
    title: string;
    one: string;
    /** Адрес материала на сайте */
    site: string;
    url?: boolean;
    category?: "single" | "blog";
    author?: boolean;
    isGudserfing?: boolean;
}

const KINDS: Record<ContentKind, Kind> = {
    news: { api: "news", href: "/admin/news", title: "Новости", one: "новость", site: "/news", category: "single", author: true },
    blog: { api: "blog", href: "/admin/blog", title: "Блог", one: "статью", site: "/blog", category: "blog", author: true, isGudserfing: true },
    journal: { api: "journal", href: "/admin/journals", title: "Журналы", one: "журнал", site: "/journals", url: true },
    video: { api: "video", href: "/admin/video", title: "Видео", one: "видео", site: "/video", url: true, category: "single", author: true },
};

const fio = (a?: { firstName: string | null; lastName: string | null } | null) => [a?.firstName, a?.lastName].filter(Boolean).join(" ");

const listConfig = (k: Kind): AdminListConfig<ContentRow> => ({
    title: k.title,
    path: k.api,
    rowKey: (r) => String(r.id),
    rowHref: (r) => `${k.href}/${r.id}`,
    createHref: `${k.href}/create`,
    filters: [{ key: "name", label: "Название" }, ...(k.author ? [{ key: "lastName", label: "Фамилия автора" }] : [])],
    columns: [
        { label: "Название", cell: (r) => r.name || "—" },
        ...(k.category ? [{ label: "Категория", cell: (r: ContentRow) => r.categoryName || "—" }] : []),
        ...(k.author ? [{ label: "Автор", cell: (r: ContentRow) => fio(r.author) || "—" }] : []),
        { label: "Опубликовано", cell: (r) => <YesNo value={r.isActive} /> },
        { label: "Комментариев", cell: (r) => r.reviewCount, className: "text-right" },
        { label: "Создано", cell: (r) => r.created, className: "whitespace-nowrap" },
    ],
    remove: { path: (r) => `${k.api}/${r.id}`, confirm: (r) => `Удалить «${r.name ?? r.id}»?` },
});

const formConfig = (kind: ContentKind): AdminFormConfig => {
    const k = KINDS[kind];
    const fields: AdminField[] = [
        { key: "name", label: "Название", required: true, wide: true },
        ...(k.url ? [{ key: "url", label: kind === "journal" ? "Ссылка на журнал (Calameo и т. п.)" : "Ссылка на видео", required: true, wide: true }] : []),
        ...(k.category === "single" ? [{ key: "categoryId", label: "Категория", type: "custom" as const, required: true, initial: (r: Record<string, unknown> | null) => (r?.category as { id?: number } | null)?.id ?? null, render: (v: unknown, set: (x: unknown) => void) => <DictField path="category" value={v} onChange={set} /> }] : []),
        ...(k.category === "blog" ? [{ key: "blogCategoryIds", label: "Категории блога", type: "custom" as const, wide: true, initial: (r: Record<string, unknown> | null) => ((r?.categories as { id: number }[] | undefined) ?? []).map((c) => c.id), render: (v: unknown, set: (x: unknown) => void) => <DictField path="blog-category" multiple value={v} onChange={set} /> }] : []),
        ...(k.author ? [{ key: "author", label: "Автор", type: "custom" as const, required: true, initial: (r: Record<string, unknown> | null) => userFrom(r?.author), render: (v: unknown, set: (x: unknown) => void) => <UserField value={v} onChange={set} /> }] : []),
        { key: "isActive", label: "Опубликовано", type: "checkbox" },
        ...(k.isGudserfing ? [{ key: "isGudserfing", label: "Статья Гудсёрфинга (не пользователя)", type: "checkbox" as const }] : []),
        { key: "image", label: "Обложка", type: "custom", required: true, wide: true, initial: (r) => imageFrom(r?.image), render: (v, set) => <ImageUploadField value={v} onChange={set} /> },
        kind === "video"
            ? { key: "description", label: "Описание", type: "textarea" }
            : { key: "description", label: "Текст", type: "custom", wide: true, initial: (r) => (typeof r?.description === "string" ? r.description : ""), render: (v, set) => <HtmlField value={v} onChange={set} /> },
    ];
    return {
        title: (r) => r ? String(r.name ?? "") : `Добавить ${k.one}`,
        back: { href: k.href, label: k.title },
        load: (id) => `${k.api}/${id}`,
        format: "json",
        fields,
        create: { method: "POST", path: k.api },
        update: (id) => ({ method: "PATCH", path: `${k.api}/${id}` }),
        // Обложка и автор — объектами в форме, в API — id (CreateAdmin* старой админки)
        toBody: (values) => {
            const { image, author, ...rest } = values as { image?: UploadedImage | null; author?: PickedUser | null } & Record<string, unknown>;
            return { ...rest, imageId: image?.id ?? null, ...(k.author ? { authorId: author?.id ?? null } : {}) };
        },
        extra: (r) => <p className="text-muted"><a href={`${k.site}/${String(r.slug ?? r.id)}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">Открыть на сайте</a></p>,
    };
};

export function ContentList({ kind }: { kind: ContentKind }) {
    return <AdminList config={listConfig(KINDS[kind])} />;
}

export function ContentCard({ kind, id }: { kind: ContentKind; id: string }) {
    return <AdminForm config={formConfig(kind)} id={id} />;
}

/* ── Комментарии к материалам ── */

export type CommentKind = "news" | "blog" | "journal" | "video";

interface CommentRow {
    id: string | number;
    description: string;
    isActive: boolean;
    created: string;
    author?: { firstName: string | null; lastName: string | null } | null;
    blog?: { name: string } | null;
    news?: { name: string } | null;
    journal?: { name: string } | null;
    video?: { name: string } | null;
}

const COMMENT_TITLES: Record<CommentKind, string> = { news: "к новостям", blog: "к статьям блога", journal: "к журналам", video: "к видео" };

const commentsConfig = (kind: CommentKind): AdminListConfig<CommentRow> => ({
    title: `Комментарии ${COMMENT_TITLES[kind]}`,
    path: `review-${kind}`,
    rowKey: (r) => String(r.id),
    rowHref: (r) => `/admin/reviews-${kind === "journal" ? "journals" : kind}/${r.id}`,
    columns: [
        { label: "Комментарий", cell: (r) => (r.description.length > 140 ? `${r.description.slice(0, 140)}…` : r.description) },
        { label: "К чему", cell: (r) => r[kind]?.name ?? "—" },
        { label: "Автор", cell: (r) => fio(r.author) || "—" },
        { label: "Показан", cell: (r) => <YesNo value={r.isActive} /> },
        { label: "Когда", cell: (r) => r.created, className: "whitespace-nowrap" },
    ],
    actions: (r, { api, reload, notify }) => (
        <button
            type="button"
            className="cursor-pointer rounded-[6px] border border-primary px-3 py-1.5 text-primary hover:bg-primary hover:text-white"
            onClick={() => void api.patch(`review-${kind}/${r.id}`, { description: r.description, isActive: !r.isActive })
                .then(() => {
                    notify(r.isActive ? "Скрыт" : "Показан", true);
                    reload();
                })
                .catch((e: unknown) => notify(e instanceof Error ? e.message : "Ошибка"))}
        >
            {r.isActive ? "Скрыть" : "Показать"}
        </button>
    ),
    remove: { path: (r) => `review-${kind}/${r.id}`, confirm: () => "Удалить комментарий?" },
});

export function CommentsList({ kind }: { kind: CommentKind }) {
    return <AdminList config={commentsConfig(kind)} />;
}

const commentForm = (kind: CommentKind): AdminFormConfig => ({
    title: () => `Комментарий ${COMMENT_TITLES[kind]}`,
    back: { href: `/admin/reviews-community?tab=${kind}`, label: "Комментарии" },
    load: (id) => `review-${kind}/${id}`,
    format: "json",
    fields: [
        { key: "description", label: "Текст", type: "textarea", required: true },
        { key: "isActive", label: "Показывать", type: "checkbox" },
    ],
    create: { method: "POST", path: `review-${kind}` },
    update: (id) => ({ method: "PATCH", path: `review-${kind}/${id}` }),
});

export function CommentCard({ kind, id }: { kind: CommentKind; id: string }) {
    return <AdminForm config={commentForm(kind)} id={id} />;
}
