"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

import { useOptionalSession } from "@/components/session/SessionProvider";
import { API_URL, browserApi } from "@/lib/browserApi";

export interface AddVideoLabels {
    open: string;
    title: string;
    name: string; namePlaceholder: string;
    description: string; descriptionPlaceholder: string;
    url: string; urlPlaceholder: string;
    cover: string; coverRequired: string;
    category: string; categoryRequired: string;
    required: { name: string; description: string; url: string };
    min: string; max: string;
    publish: string; close: string;
    success: string; error: string;
}

/**
 * «Добавить видео» (VideoModalForm старого фронта): название и описание
 * (2–100 символов), ссылка, обложка, категория; «Опубликовать» создаёт
 * видео от имени вошедшего, после — страница обновляется.
 */
export function AddVideoDialog({ categories, labels }: { categories: { id: number; name: string; color: string }[]; labels: AddVideoLabels }) {
    const session = useOptionalSession();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", url: "", categoryId: 0 });
    const [cover, setCover] = useState<{ id: string; url: string } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const validate = () => {
        const next: Record<string, string> = {};
        const length = (value: string, key: "name" | "description") => {
            if (!value.trim()) next[key] = labels.required[key];
            else if (value.trim().length < 2) next[key] = labels.min;
            else if (value.length > 100) next[key] = labels.max;
        };
        length(form.name, "name");
        length(form.description, "description");
        if (!form.url.trim()) next.url = labels.required.url;
        if (!cover) next.cover = labels.coverRequired;
        if (!form.categoryId) next.category = labels.categoryRequired;
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const upload = async (file: File | undefined) => {
        if (!file) return;
        const body = new FormData();
        body.append("file", file);
        const response = await fetch(`${API_URL}/api/v1/media_objects`, {
            method: "POST",
            credentials: "include",
            headers: { Accept: "application/ld+json", ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}) },
            body,
        }).catch(() => null);
        if (!response?.ok) {
            setErrors((prev) => ({ ...prev, cover: labels.error }));
            return;
        }
        const media = await response.json() as { id: string; contentUrl: string; thumbnails?: { medium?: string } | null };
        setCover({ id: media.id, url: media.thumbnails?.medium || media.contentUrl });
        setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => key !== "cover")));
    };

    const submit = async () => {
        if (!validate() || !cover) return;
        setBusy(true);
        const { error } = await browserApi(session?.token)
            .POST("/api/v1/video", { body: { ...form, imageId: cover.id, isActive: true } as never })
            .catch(() => ({ error: true }));
        setBusy(false);
        if (error) {
            setMessage(labels.error);
            return;
        }
        setOpen(false);
        setMessage(labels.success);
        window.location.reload();
    };

    const field = "mt-2 box-border h-[50px] w-full rounded-[10px] border border-[#82949F] px-3.5 text-[16px] outline-none data-[error=true]:border-error";
    const input = (key: "name" | "description" | "url", label: string, placeholder: string) => (
        <label className="flex flex-col text-[14px] text-[#82949F]">
            {label}
            <input
                value={form[key]}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                placeholder={placeholder}
                data-error={!!errors[key]}
                className={`${field} text-ink`}
            />
            {errors[key] && <span className="mt-1 text-[12px] text-error">{errors[key]}</span>}
        </label>
    );

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className="cursor-pointer rounded-[10px] border border-cta bg-cta px-[50px] py-2.5 text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-cta">
                {labels.open}
            </button>
            {message && <div role="status" className="fixed top-5 left-1/2 z-[1000] -translate-x-1/2 rounded-[10px] bg-white px-5 py-3 shadow-lg">{message}</div>}
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in items-center justify-center bg-black/50">
                        <Dialog.Content aria-describedby={undefined} className="max-h-[650px] w-[600px] max-w-[95vw] overflow-y-auto rounded-[12px] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                            <Dialog.Title className="mb-7 text-center text-[18px] font-bold text-[#1a1a1a]">{labels.title}</Dialog.Title>
                            <form className="flex flex-col gap-6" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
                                {input("name", labels.name, labels.namePlaceholder)}
                                {input("description", labels.description, labels.descriptionPlaceholder)}
                                {input("url", labels.url, labels.urlPlaceholder)}
                                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-caption bg-field p-5 text-center text-[14px] text-caption">
                                    {cover
                                        // eslint-disable-next-line @next/next/no-img-element -- загруженная обложка
                                        ? <img src={cover.url} alt="" className="max-h-[200px] object-cover" />
                                        : labels.cover}
                                    <input type="file" accept="image/*" hidden onChange={(event) => void upload(event.target.files?.[0])} />
                                    {errors.cover && <span className="text-[12px] text-error">{errors.cover}</span>}
                                </label>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[0.875rem] leading-[100%] text-[#82949F]">{labels.category}</span>
                                    <div role="radiogroup" aria-label={labels.category} className="flex flex-wrap gap-2.5">
                                        {categories.map((category) => {
                                            const selected = form.categoryId === category.id;
                                            return (
                                                <button
                                                    key={category.id}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={selected}
                                                    onClick={() => setForm({ ...form, categoryId: selected ? 0 : category.id })}
                                                    style={{ borderColor: category.color, backgroundColor: selected ? category.color : "transparent" }}
                                                    className="cursor-pointer rounded-[40px] border px-2.5 py-[3px] text-[14px]"
                                                >
                                                    {category.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.category && <span className="text-[12px] text-error">{errors.category}</span>}
                                </div>
                                <button type="submit" disabled={busy} className="cursor-pointer rounded-[10px] border border-primary bg-primary px-[50px] py-2.5 text-[16px] leading-[120%] text-white hover:bg-white hover:text-primary disabled:opacity-70">
                                    {labels.publish}
                                </button>
                            </form>
                            <Dialog.Close className="sr-only">{labels.close}</Dialog.Close>
                        </Dialog.Content>
                    </Dialog.Overlay>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}
