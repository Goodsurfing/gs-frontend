"use client";

import { useEffect, useState } from "react";

import { adminButton, adminInput } from "@/components/admin/AdminList";
import { ArticleEditor } from "@/components/cabinet/volunteer/articles/ArticleEditor";
import { useSession } from "@/components/session/SessionProvider";
import { type AdminPage, useAdminApi } from "@/lib/admin/api";
import { MAX_UPLOAD_SIZE, uploadMedia } from "@/lib/uploadMedia";

/** Поля форм админки со своей логикой: HTML-текст, обложка, справочник, автор */

const EDITOR_LABELS = {
    bold: "Жирный", italic: "Курсив", underline: "Подчёркнутый", alignLeft: "По левому краю", alignCenter: "По центру", alignJustify: "По ширине",
    ordered: "Нумерованный список", bullet: "Маркированный список", link: "Ссылка", image: "Картинка", emoji: "Эмодзи", undo: "Отменить", redo: "Повторить", clear: "Очистить форматирование", text: "Текст",
};

export function HtmlField({ value, onChange }: { value: unknown; onChange: (html: string) => void }) {
    const { token } = useSession();
    const [error, setError] = useState<string | null>(null);
    return (
        <div>
            <ArticleEditor value={typeof value === "string" ? value : ""} onChange={onChange} token={token} labels={EDITOR_LABELS} onUploadError={() => setError("Не удалось загрузить картинку")} onBadLink={() => setError("Такую ссылку вставить нельзя")} />
            {error && <p className="mt-1 text-[12px] text-error">{error}</p>}
        </div>
    );
}

export interface UploadedImage { id: string; url: string | null }

/** Картинка из записи API ({id, contentUrl}) → значение поля */
export const imageFrom = (raw: unknown): UploadedImage | null => {
    const img = raw as { id?: string; contentUrl?: string | null } | null | undefined;
    return img?.id ? { id: img.id, url: img.contentUrl ?? null } : null;
};

/** Обложка: загрузка в /api/v1/media_objects, в тело уходит id */
export function ImageUploadField({ value, onChange }: { value: unknown; onChange: (v: UploadedImage | null) => void }) {
    const { token } = useSession();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const image = value as UploadedImage | null;
    return (
        <span className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- превью обложки, размер мал */}
            {image?.url ? <img src={image.url} alt="" loading="eager" width={96} height={72} className="h-[72px] w-[96px] rounded-[6px] bg-field object-cover" /> : <span className="flex h-[72px] w-[96px] items-center justify-center rounded-[6px] bg-field text-[11px] text-muted">нет</span>}
            <input
                type="file"
                accept="image/*"
                aria-label="Загрузить картинку"
                disabled={busy}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    if (file.size > MAX_UPLOAD_SIZE) {
                        setError("Файл больше 5 МБ");
                        return;
                    }
                    setBusy(true);
                    setError(null);
                    uploadMedia(file, token)
                        .then((m) => onChange({ id: m.id, url: m.contentUrl ?? null }))
                        .catch(() => setError("Не удалось загрузить"))
                        .finally(() => setBusy(false));
                }}
            />
            {busy && <span className="text-muted">загрузка…</span>}
            {error && <span className="text-error">{error}</span>}
        </span>
    );
}

/** Выбор из справочника API админки: один id (select) или несколько (флажки) */
export function DictField({ path, multiple = false, value, onChange }: { path: string; multiple?: boolean; value: unknown; onChange: (v: unknown) => void }) {
    const api = useAdminApi();
    const [items, setItems] = useState<{ id: number; name: string }[] | null>(null);
    useEffect(() => {
        api.get<AdminPage<{ id: number; name: string }>>(path, { page: 1, limit: 200 }).then((r) => setItems(r.data ?? [])).catch(() => setItems([]));
    }, [api, path]);
    if (items === null) return <span className="text-muted">загрузка…</span>;
    if (!multiple) {
        return (
            <select className={adminInput} value={value === null || value === undefined ? "" : String(value)} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}>
                <option value="">—</option>
                {items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
        );
    }
    const selected = Array.isArray(value) ? (value as number[]) : [];
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((i) => (
                <label key={i.id} className={`cursor-pointer rounded-full border px-3 py-1 ${selected.includes(i.id) ? "border-primary bg-primary/10" : "border-accent-bg"}`}>
                    <input type="checkbox" className="sr-only" checked={selected.includes(i.id)} onChange={() => onChange(selected.includes(i.id) ? selected.filter((x) => x !== i.id) : [...selected, i.id])} />
                    {i.name}
                </label>
            ))}
        </div>
    );
}

export interface PickedUser { id: string; name: string }

/** Автор: текущий + поиск пользователя по точному email (user/search) */
export function UserField({ value, onChange }: { value: unknown; onChange: (v: PickedUser | null) => void }) {
    const api = useAdminApi();
    const [email, setEmail] = useState("");
    const [found, setFound] = useState<PickedUser[] | null>(null);
    const current = value as PickedUser | null;
    return (
        <div className="flex flex-col gap-2">
            <span>{current ? current.name : <span className="text-muted">не выбран</span>}{current && <button type="button" className="ml-2 cursor-pointer text-[12px] text-error" onClick={() => onChange(null)}>убрать</button>}</span>
            <span className="flex flex-wrap gap-2">
                <input type="email" aria-label="Email автора" placeholder="email пользователя" className={`${adminInput} max-w-[280px]`} value={email} onChange={(e) => setEmail(e.target.value)} />
                <button
                    type="button"
                    className={adminButton}
                    onClick={() => void api.get<{ id: string; email?: string; firstName: string | null; lastName: string | null }[]>("user/search", { email: email.trim(), limit: 5 })
                        .then((list) => setFound(list.map((u) => ({ id: u.id, name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || u.id }))))
                        .catch(() => setFound([]))}
                >
                    Найти
                </button>
            </span>
            {found?.length === 0 && <span className="text-muted">не найден</span>}
            {found?.map((u) => <button key={u.id} type="button" className={`${adminButton} self-start`} onClick={() => { onChange(u); setFound(null); setEmail(""); }}>Выбрать: {u.name}</button>)}
        </div>
    );
}

/** Автор из записи API ({id, firstName, lastName}) → значение поля */
export const userFrom = (raw: unknown): PickedUser | null => {
    const a = raw as { id?: string; firstName?: string | null; lastName?: string | null } | null | undefined;
    return a?.id ? { id: a.id, name: [a.firstName, a.lastName].filter(Boolean).join(" ") || a.id } : null;
};
