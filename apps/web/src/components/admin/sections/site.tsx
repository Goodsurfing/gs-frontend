"use client";

import { useEffect, useState } from "react";

import { AdminForm, type AdminFormConfig } from "@/components/admin/AdminForm";
import { adminButton, adminButtonPrimary, adminInput, AdminList, type AdminListConfig, YesNo } from "@/components/admin/AdminList";
import { imageFrom, ImageUploadField, type PickedUser, type UploadedImage, userFrom, UserField } from "@/components/admin/fields";
import { useSession } from "@/components/session/SessionProvider";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { useAdminApi } from "@/lib/admin/api";
import { safeHref } from "@/lib/safeHref";
import { uploadMedia } from "@/lib/uploadMedia";

/** Разделы о сайте: амбассадоры, команда, реклама, отчётность, «О проекте» */

const imageField = (required = true) => ({ key: "image", label: "Фото", type: "custom" as const, required, wide: true, initial: (r: Record<string, unknown> | null) => imageFrom(r?.image), render: (v: unknown, set: (x: unknown) => void) => <ImageUploadField value={v} onChange={set} /> });
const userField = { key: "user", label: "Пользователь на сайте (необязательно)", type: "custom" as const, initial: (r: Record<string, unknown> | null) => (r?.userId ? { id: String(r.userId), name: String(r.userId) } : userFrom(r?.user)), render: (v: unknown, set: (x: unknown) => void) => <UserField value={v} onChange={set} /> };
const withIds = (values: Record<string, unknown>) => {
    const { image, user, ...rest } = values as { image?: UploadedImage | null; user?: PickedUser | null } & Record<string, unknown>;
    return { ...rest, imageId: image?.id ?? null, ...("user" in values ? { userId: user?.id ?? null } : {}) };
};

/* ── Амбассадоры (лидеры) ── */

interface LeaderRow { id: string; firstName: string; lastName: string; description: string; country: string | null; city: string | null; sort: number }

export const leadersList: AdminListConfig<LeaderRow> = {
    title: "Амбассадоры",
    path: "leader/",
    rowKey: (r) => r.id,
    rowHref: (r) => `/admin/ambassadors/${r.id}`,
    createHref: "/admin/ambassadors/create",
    columns: [
        { label: "Имя", cell: (r) => `${r.firstName} ${r.lastName}` },
        { label: "Откуда", cell: (r) => [r.country, r.city].filter(Boolean).join(", ") || "—" },
        { label: "О себе", cell: (r) => r.description },
        { label: "Порядок", cell: (r) => r.sort, className: "text-right" },
    ],
    remove: { path: (r) => `leader/${r.id}`, confirm: (r) => `Удалить амбассадора ${r.firstName} ${r.lastName}?` },
};

export const leaderForm: AdminFormConfig = {
    title: (r) => r ? `${String(r.firstName)} ${String(r.lastName)}` : "Добавить амбассадора",
    back: { href: "/admin/ambassadors", label: "Амбассадоры" },
    load: (id) => `leader/${id}`,
    format: "json",
    fields: [
        { key: "firstName", label: "Имя", required: true }, { key: "lastName", label: "Фамилия", required: true },
        { key: "country", label: "Страна" }, { key: "city", label: "Город" },
        { key: "sort", label: "Порядок (меньше — выше)", type: "number" },
        { key: "description", label: "О себе", type: "textarea", required: true },
        imageField(), userField,
    ],
    create: { method: "POST", path: "leader/" },
    update: (id) => ({ method: "PATCH", path: `leader/${id}` }),
    toBody: (v) => withIds(v),
};

/* ── Наша команда ── */

interface TeamRow { id: string; firstName: string; lastName: string; position: string; isFounder: boolean; sort: number }

export const teamList: AdminListConfig<TeamRow> = {
    title: "Наша команда",
    path: "our-team/",
    rowKey: (r) => r.id,
    rowHref: (r) => `/admin/our-team/${r.id}`,
    createHref: "/admin/our-team/create",
    columns: [
        { label: "Имя", cell: (r) => `${r.firstName} ${r.lastName}` },
        { label: "Должность", cell: (r) => r.position },
        { label: "Основатель", cell: (r) => <YesNo value={r.isFounder} /> },
        { label: "Порядок", cell: (r) => r.sort, className: "text-right" },
    ],
    remove: { path: (r) => `our-team/${r.id}`, confirm: (r) => `Удалить ${r.firstName} ${r.lastName} из команды?` },
};

export const teamForm: AdminFormConfig = {
    title: (r) => r ? `${String(r.firstName)} ${String(r.lastName)}` : "Добавить в команду",
    back: { href: "/admin/our-team", label: "Наша команда" },
    load: (id) => `our-team/${id}`,
    format: "json",
    fields: [
        { key: "firstName", label: "Имя", required: true }, { key: "lastName", label: "Фамилия", required: true },
        { key: "position", label: "Должность", required: true }, { key: "sort", label: "Порядок (меньше — выше)", type: "number" },
        { key: "vkontakte", label: "ВКонтакте" }, { key: "telegram", label: "Telegram" },
        { key: "isFounder", label: "Основатель", type: "checkbox" },
        imageField(), userField,
    ],
    create: { method: "POST", path: "our-team/" },
    update: (id) => ({ method: "PATCH", path: `our-team/${id}` }),
    toBody: (v) => withIds(v),
};

/* ── Реклама (баннеры) ── */

interface BannerRow { id: string; name: string; url: string; description: string; isActive: boolean; type: string | null }

const BANNER_TYPES = [
    { value: "UNDER_HEADER_ALL_PAGES", label: "Под шапкой на всех страницах" },
    { value: "MAIN_PAGE", label: "На главной" },
    { value: "VACANCY_PAGE", label: "На странице вакансии" },
];

export const bannersList: AdminListConfig<BannerRow> = {
    title: "Реклама",
    path: "marketing-banner/",
    rowKey: (r) => r.id,
    rowHref: (r) => `/admin/banner-marketing/${r.id}`,
    createHref: "/admin/banner-marketing/create",
    columns: [
        { label: "Название", cell: (r) => r.name },
        { label: "Где", cell: (r) => BANNER_TYPES.find((t) => t.value === r.type)?.label ?? r.type ?? "—" },
        { label: "Ссылка", cell: (r) => <a href={safeHref(r.url)} target="_blank" rel="noreferrer" className="text-primary hover:underline">{r.url}</a> },
        { label: "Показывается", cell: (r) => <YesNo value={r.isActive} /> },
    ],
    remove: { path: (r) => `marketing-banner/${r.id}`, confirm: (r) => `Удалить баннер «${r.name}»?` },
};

export const bannerForm: AdminFormConfig = {
    title: (r) => r ? String(r.name) : "Новый баннер",
    back: { href: "/admin/banner-marketing", label: "Реклама" },
    load: (id) => `marketing-banner/${id}`,
    format: "json",
    fields: [
        { key: "name", label: "Название", required: true }, { key: "url", label: "Ссылка", required: true },
        { key: "type", label: "Где показывать", type: "select", options: BANNER_TYPES, required: true },
        { key: "isActive", label: "Показывать", type: "checkbox" },
        { key: "description", label: "Текст", type: "textarea" },
        { ...imageField(false), label: "Картинка" },
    ],
    create: { method: "POST", path: "marketing-banner/" },
    update: (id) => ({ method: "PATCH", path: `marketing-banner/${id}` }),
    toBody: (v) => withIds(v),
};

/* ── Публичная отчётность ── */

interface ReportRow { id: string; name: string }
interface ReportFile { name: string; fileId: string; url?: string | null }

export const reportsList: AdminListConfig<ReportRow> = {
    title: "Публичная отчётность",
    path: "report",
    plain: true,
    rowKey: (r) => r.id,
    rowHref: (r) => `/admin/donation-reports/${r.id}`,
    createHref: "/admin/donation-reports/create",
    columns: [{ label: "Отчёт", cell: (r) => r.name }],
    remove: { path: (r) => `report/${r.id}`, confirm: (r) => `Удалить отчёт «${r.name}»?` },
};

/** Файлы отчёта: название и загрузка (PDF, картинки) в media_objects */
function ReportFiles({ value, onChange }: { value: unknown; onChange: (v: ReportFile[]) => void }) {
    const { token } = useSession();
    const files = Array.isArray(value) ? (value as ReportFile[]) : [];
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    return (
        <div className="flex flex-col gap-2">
            {files.map((f, i) => (
                <div key={f.fileId} className="flex flex-wrap items-center gap-2">
                    <input aria-label={`Название файла ${i + 1}`} className={`${adminInput} max-w-[360px]`} value={f.name} onChange={(e) => onChange(files.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                    {safeHref(f.url) && <a href={safeHref(f.url)} target="_blank" rel="noreferrer" className="text-primary hover:underline">файл</a>}
                    <button type="button" className={adminButton} onClick={() => onChange(files.filter((_, j) => j !== i))}>Убрать</button>
                </div>
            ))}
            <label className="flex items-center gap-2">
                <span className={adminButton}>Добавить файл</span>
                <input
                    type="file"
                    className="sr-only"
                    disabled={busy}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        if (!file) return;
                        setBusy(true);
                        setError(null);
                        uploadMedia(file, token)
                            .then((m) => onChange([...files, { name: file.name.replace(/\.[^.]+$/, ""), fileId: m.id, url: m.contentUrl ?? null }]))
                            .catch(() => setError("Не удалось загрузить файл"))
                            .finally(() => setBusy(false));
                    }}
                />
                {busy && <span className="text-muted">загрузка…</span>}
                {error && <span className="text-error">{error}</span>}
            </label>
        </div>
    );
}

export const reportForm: AdminFormConfig = {
    title: (r) => r ? String(r.name) : "Новый отчёт",
    back: { href: "/admin/donation-reports", label: "Отчётность" },
    load: (id) => `report/${id}`,
    format: "json",
    fields: [
        { key: "name", label: "Название", required: true, wide: true },
        {
            key: "files", label: "Файлы", type: "custom", wide: true,
            initial: (r) => ((r?.files as { name: string; file: { id: string; contentUrl?: string | null } }[] | undefined) ?? []).map((f) => ({ name: f.name, fileId: f.file.id, url: f.file.contentUrl ?? null })),
            render: (v, set) => <ReportFiles value={v} onChange={set} />,
        },
    ],
    create: { method: "POST", path: "report" },
    update: (id) => ({ method: "PATCH", path: `report/${id}` }),
    toBody: (v) => ({ name: v.name, files: ((v.files as ReportFile[] | undefined) ?? []).map(({ name, fileId }) => ({ name, fileId })) }),
};

/* ── О проекте ── */

const BOLD_HINT = "Абзацы — пустой строкой, жирный — **так** (как выводит сайт, lib/boldText).";

interface Principle { name: string; description: string; image: UploadedImage | null }

/** «О проекте» (AdminAboutProjectForm старой админки): миссия, история, принципы, галерея */
export function AboutProjectEditor() {
    const api = useAdminApi();
    const { token } = useSession();
    const [data, setData] = useState<{ mission: string; howAllStart: string; principles: Principle[]; gallery: UploadedImage[] } | null | "error">(null);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    useEffect(() => {
        api.get<{ mission: string | null; howAllStart: string | null; principles: { name: string; description: string; image: unknown }[]; galleryImages: unknown[] }>("about-project/element")
            .then((d) => setData({
                mission: d.mission ?? "",
                howAllStart: d.howAllStart ?? "",
                principles: (d.principles ?? []).map((p) => ({ name: p.name, description: p.description, image: imageFrom(p.image) })),
                gallery: (d.galleryImages ?? []).map(imageFrom).filter((x): x is UploadedImage => x !== null),
            }))
            .catch(() => setData("error"));
    }, [api]);

    if (data === null) return <Spinner />;
    if (data === "error") return <p className="text-error">Не удалось загрузить</p>;

    const save = async () => {
        setBusy(true);
        try {
            await api.patch("about-project/edit", {
                mission: data.mission,
                howAllStart: data.howAllStart,
                principles: data.principles.map((p) => ({ name: p.name, description: p.description, imageId: p.image?.id ?? null })),
                galleryImageIds: data.gallery.map((g) => g.id),
            });
            setToast({ text: "Сохранено", ok: true });
        } catch (e) {
            setToast({ text: e instanceof Error ? e.message : "Не удалось сохранить", ok: false });
        } finally {
            setBusy(false);
        }
    };
    const setPrinciple = (i: number, patch: Partial<Principle>) => setData({ ...data, principles: data.principles.map((p, j) => (j === i ? { ...p, ...patch } : p)) });

    return (
        <div className="flex max-w-[1000px] flex-col gap-5">
            <h1 className="text-[22px] font-bold">О проекте</h1>
            {/* Простой текст: сайт выводит его с переносами строк (whitespace-pre-line), не HTML */}
            <section className="rounded-[8px] bg-surface p-4"><h2 className="mb-2 font-bold">Миссия</h2><textarea aria-label="Миссия" className={`${adminInput} min-h-[220px]`} value={data.mission} onChange={(e) => setData({ ...data, mission: e.target.value })} /><p className="mt-1 text-[11px] text-muted">{BOLD_HINT}</p></section>
            <section className="rounded-[8px] bg-surface p-4"><h2 className="mb-2 font-bold">Как всё начиналось</h2><textarea aria-label="Как всё начиналось" className={`${adminInput} min-h-[220px]`} value={data.howAllStart} onChange={(e) => setData({ ...data, howAllStart: e.target.value })} /><p className="mt-1 text-[11px] text-muted">{BOLD_HINT}</p></section>
            <section className="rounded-[8px] bg-surface p-4">
                <h2 className="mb-2 font-bold">Принципы</h2>
                {data.principles.map((p, i) => (
                    <div key={i} className="mb-3 grid grid-cols-[1fr_auto] gap-2 border-b border-accent-bg pb-3">
                        <input aria-label={`Принцип ${i + 1}`} className={adminInput} value={p.name} onChange={(e) => setPrinciple(i, { name: e.target.value })} />
                        <button type="button" className={adminButton} onClick={() => setData({ ...data, principles: data.principles.filter((_, j) => j !== i) })}>Убрать</button>
                        <textarea aria-label={`Описание принципа ${i + 1}`} className={`${adminInput} col-span-2 min-h-[70px]`} value={p.description} onChange={(e) => setPrinciple(i, { description: e.target.value })} />
                        <div className="col-span-2"><ImageUploadField value={p.image} onChange={(img) => setPrinciple(i, { image: img })} /></div>
                    </div>
                ))}
                <button type="button" className={adminButton} onClick={() => setData({ ...data, principles: [...data.principles, { name: "", description: "", image: null }] })}>Добавить принцип</button>
            </section>
            <section className="rounded-[8px] bg-surface p-4">
                <h2 className="mb-2 font-bold">Галерея</h2>
                <div className="mb-3 flex flex-wrap gap-2">
                    {data.gallery.map((g, i) => (
                        <span key={g.id} className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element -- превью галереи, размер мал */}
                            {g.url && <img src={g.url} alt="" loading="lazy" width={120} height={90} className="h-[90px] w-[120px] rounded-[6px] object-cover" />}
                            <button type="button" aria-label="Убрать фото" className="absolute top-1 right-1 cursor-pointer rounded-full bg-surface px-2 text-error" onClick={() => setData({ ...data, gallery: data.gallery.filter((_, j) => j !== i) })}>×</button>
                        </span>
                    ))}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    aria-label="Добавить фото в галерею"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        if (file) void uploadMedia(file, token).then((m) => setData((d) => (d && d !== "error" ? { ...d, gallery: [...d.gallery, { id: m.id, url: m.contentUrl ?? null }] } : d))).catch(() => setToast({ text: "Не удалось загрузить фото", ok: false }));
                    }}
                />
            </section>
            <div><button type="button" className={adminButtonPrimary} disabled={busy} onClick={() => void save()}>Сохранить</button></div>
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
        </div>
    );
}

export function SiteList({ kind }: { kind: "leaders" | "team" | "banners" | "reports" }) {
    const config = { leaders: leadersList, team: teamList, banners: bannersList, reports: reportsList }[kind] as AdminListConfig<unknown>;
    return <AdminList config={config} />;
}

export function SiteCard({ kind, id }: { kind: "leaders" | "team" | "banners" | "reports"; id: string }) {
    const config = { leaders: leaderForm, team: teamForm, banners: bannerForm, reports: reportForm }[kind];
    return <AdminForm config={config} id={id} />;
}
