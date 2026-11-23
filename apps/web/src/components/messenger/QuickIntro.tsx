"use client";

import { useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { type Profile, toBody, toForm } from "@/lib/profileForm";
import { shrinkImage } from "@/lib/shrinkImage";
import { MAX_UPLOAD_SIZE, uploadMedia } from "@/lib/uploadMedia";

export interface QuickIntroLabels {
    title: string;
    text: string;
    name: string;
    save: string;
    saved: string;
    photo: string;
    uploading: string;
    error: string;
}

/** Нет имени или фото — организатор видит отклик «без лица»; показываем блок */
export function needsIntro(profile: Record<string, unknown> | null): boolean {
    if (!profile) return false;
    const name = typeof profile.firstName === "string" ? profile.firstName.trim() : "";
    return !name || !profile.image;
}

/**
 * Над откликом новичка: имя и фото, чтобы организатор понял, кто пишет (06.11.2026). Необязательно —
 * отклик отправляется и без них. Сохраняется сразу: фото — после выбора (уменьшается до 1024 px),
 * имя — кнопкой. PATCH /profile перезаписывает профиль целиком — в тело идёт весь текущий профиль.
 */
export function QuickIntro({ labels }: { labels: QuickIntroLabels }) {
    const session = useSession();
    const profile = session.profile as Profile | null;
    const [name, setName] = useState(() => (typeof profile?.firstName === "string" ? profile.firstName : ""));
    const [preview, setPreview] = useState<string | null>(null);
    const [state, setState] = useState<"idle" | "busy" | "saved" | "error">("idle");
    if (!profile) return null;

    const save = async (patch: { firstName?: string; image?: { id: string; contentUrl: string; thumbnails?: unknown } }) => {
        const api = browserApi(session.token);
        const form = { ...toForm(profile), ...patch };
        const { error } = await api.PATCH("/api/v1/profile", { body: toBody(form) as never });
        if (error) throw new Error("save");
        const fresh = await api.GET("/api/v1/profile").catch(() => null);
        if (fresh?.data) session.updateProfile(fresh.data);
    };

    const saveName = async () => {
        if (!name.trim()) return;
        setState("busy");
        try {
            await save({ firstName: name.trim() });
            setState("saved");
        } catch {
            setState("error");
        }
    };

    const upload = async (file: File | undefined) => {
        if (!file || !file.type.startsWith("image/")) return;
        setPreview(URL.createObjectURL(file));
        setState("busy");
        try {
            const small = await shrinkImage(file);
            if (small.size > MAX_UPLOAD_SIZE) throw new Error("size");
            const media = await uploadMedia(small, session.token);
            await save({ image: { id: media.id, contentUrl: media.contentUrl, thumbnails: media.thumbnails } });
            setState("saved");
        } catch {
            setPreview(null);
            setState("error");
        }
    };

    const avatar = preview ?? mediaUrl(profile.image as never, "small");
    return (
        <section aria-label={labels.title} className="mb-4 flex flex-wrap items-center gap-4 rounded-[12px] border border-accent-bg bg-white p-4">
            <label className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-bg ${state === "busy" ? "cursor-wait" : "cursor-pointer"}`}>
                {avatar
                    // eslint-disable-next-line @next/next/no-img-element -- аватар или превью до загрузки
                    ? <img src={avatar} alt="" loading="lazy" width={56} height={56} className="h-full w-full object-cover" />
                    : <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 text-caption" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><circle cx="12" cy="13" r="3.5" /></svg>}
                <input type="file" accept="image/*" aria-label={labels.photo} disabled={state === "busy"} className="sr-only" onChange={(event) => { void upload(event.target.files?.[0]); event.target.value = ""; }} />
            </label>
            <div className="min-w-[200px] flex-1">
                <p className="text-[15px] font-semibold text-ink-secondary">{labels.title}</p>
                <p className="text-[13px] text-caption">{labels.text}</p>
                <form className="mt-2 flex flex-wrap items-center gap-2" onSubmit={(event) => { event.preventDefault(); void saveName(); }}>
                    <input
                        value={name}
                        onChange={(event) => { setName(event.target.value); if (state === "saved") setState("idle"); }}
                        placeholder={labels.name}
                        aria-label={labels.name}
                        autoComplete="given-name"
                        maxLength={60}
                        className="min-w-0 flex-1 rounded-[8px] border border-accent-bg px-3 py-1.5 text-[15px] outline-none focus:border-primary"
                    />
                    <button type="submit" disabled={state === "busy" || !name.trim()} className="cursor-pointer rounded-[8px] border border-primary px-3 py-1.5 text-[14px] text-primary hover:bg-primary hover:text-white disabled:cursor-default disabled:opacity-50">{labels.save}</button>
                </form>
                <p role="status" className={`mt-1 min-h-[18px] text-[13px] ${state === "error" ? "text-error" : "text-cta"}`}>
                    {state === "busy" ? labels.uploading : state === "saved" ? labels.saved : state === "error" ? labels.error : ""}
                </p>
            </div>
        </section>
    );
}
