"use client";

import { type FormEvent, type ReactNode, useCallback, useEffect, useState } from "react";

import { AvatarInput } from "@/components/cabinet/AvatarInput";
import { blueButton, NotesTextAreaField, SelectField, TextField } from "@/components/form/fields";
import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { EMPTY_ORGANIZATION_FORM as EMPTY, ORGANIZATION_TYPES, type OrganizationForm as Form, OTHER_TYPE as OTHER, toBody, toForm } from "@/lib/hostOrganization";
import { uploadMedia } from "@/lib/uploadMedia";

export interface HostDescriptionLabels {
    name: string;
    address: string;
    short: string;
    shortHint: string;
    type: string;
    /** Подписи типов: ключ — значение в API («ИП», …, «Другое») */
    types: Record<string, string>;
    otherType: string;
    website: string;
    about: string;
    aboutHint: string;
    aboutLimit: string;
    vk: string;
    bannedNotice: string;
    required: string;
    save: string;
    created: string;
    saved: string;
    error: string;
    loadError: string;
    viewProfile: string;
    maxSize: string;
    choosePhoto: string;
    deleteImage: string;
    uploadError: string;
}

// Несохранённый ввод живёт до закрытия вкладки (как в старом фронте)
const DRAFT_KEY = "gs-web-host-description";
const readDraft = (): Form | null => {
    try {
        const raw = window.sessionStorage.getItem(DRAFT_KEY);
        return raw ? { ...EMPTY, ...JSON.parse(raw) as Partial<Form> } : null;
    } catch {
        return null;
    }
};
const writeDraft = (form: Form | null) => {
    try {
        if (form) window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
        else window.sessionStorage.removeItem(DRAFT_KEY);
    } catch {
        // хранилище недоступно — черновик просто не сохраняется
    }
};

/**
 * Описание организации (features/HostDescription старого фронта): без
 * организации — создание (POST), с ней — правка своей (PATCH). Аватар
 * загружается сразу, а записывается вместе с формой.
 */
export function HostDescriptionForm({ organizationHref, infoHref, aside, onCreated, labels }: {
    /** Публичная страница организации с {id} */
    organizationHref: string;
    /** Куда ведёт «Посмотреть профиль», пока организации нет */
    infoHref: string;
    aside?: ReactNode;
    onCreated?: () => void;
    labels: HostDescriptionLabels;
}) {
    const session = useSession();
    const hostId = (session.profile as { hostId?: string | null } | null)?.hostId ?? null;
    const [form, setForm] = useState<Form | null>(null);
    const [organizationId, setOrganizationId] = useState<string | null>(null);
    const [loadFailed, setLoadFailed] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; otherType?: string }>({});
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const [busy, setBusy] = useState(false);
    const closeToast = useCallback(() => setToast(null), []);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        const load = async () => {
            const draft = readDraft();
            if (!hostId) {
                setForm(draft ?? EMPTY);
                return;
            }
            const { data } = await browserApi(session.token).GET("/api/v1/personal/organization").catch(() => ({ data: undefined }));
            if (cancelled) return;
            if (!data?.id) {
                setLoadFailed(true);
                return;
            }
            setOrganizationId(data.id);
            setForm(draft ?? toForm(data));
        };
        void load();
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, hostId]);

    if (loadFailed) return <div className="flex w-full gap-2.5">{labels.loadError}</div>;
    if (!form) return <Loading className="min-h-[300px] w-full" />;

    const set = (patch: Partial<Form>) => {
        const next = { ...form, ...patch };
        setForm(next);
        writeDraft(next);
    };
    const field = (name: Exclude<keyof Form, "avatar">) => ({
        value: form[name],
        onChange: (event: { target: { value: string } }) => set({ [name]: event.target.value }),
    });

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const next: typeof errors = {};
        if (!form.name.trim()) next.name = labels.required;
        if (form.type === OTHER && !form.otherType.trim()) next.otherType = labels.otherType;
        setErrors(next);
        if (Object.keys(next).length) return;
        setBusy(true);
        setToast(null);
        try {
            const api = browserApi(session.token);
            const body = toBody(form);
            const { error } = organizationId
                ? await api.PATCH("/api/v1/organizations/{id}", {
                    params: { path: { id: organizationId } },
                    body: body as never,
                    headers: { "Content-Type": "application/merge-patch+json" },
                })
                : await api.POST("/api/v1/organizations", { body: { ...body, facebook: "", instagram: "", isActive: true, videoGallery: [], galleryImages: [], otherType: "" } });
            if (error) throw new Error("save");
            writeDraft(null);
            setToast({ text: organizationId ? labels.saved : labels.created, ok: true });
            if (!organizationId) onCreated?.();
        } catch {
            setToast({ text: labels.error, ok: false });
        } finally {
            setBusy(false);
        }
    };

    const upload = async (file: File) => {
        try {
            const media = await uploadMedia(file, session.token);
            set({ avatar: { iri: media["@id"], contentUrl: media.contentUrl, thumbnails: media.thumbnails } });
        } catch {
            setToast({ text: labels.uploadError, ok: false });
        }
    };

    return (
        <>
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={closeToast} />
            <form onSubmit={submit} className="flex flex-col gap-[60px] down-lg:w-full">
                <div className="flex w-full justify-between gap-2.5 down-lg:flex-col-reverse">
                    <div className="flex w-[calc(100%-264px)] flex-col down-lg:w-full">
                        <div className="flex flex-col gap-[30px]">
                            <TextField label={labels.name} minLength={3} maxLength={60} error={errors.name} {...field("name")} />
                            <TextField label={labels.address} minLength={3} maxLength={60} {...field("address")} />
                            <NotesTextAreaField label={labels.short} description={labels.shortHint} maxLength={200} {...field("shortDescription")} />
                            <div className="grid grid-cols-2 justify-between gap-6 down-lg:grid-cols-1">
                                <SelectField
                                    label={labels.type}
                                    value={form.type}
                                    onChange={(event) => set({ type: event.target.value, ...(event.target.value === OTHER ? {} : { otherType: "" }) })}
                                >
                                    {[OTHER, ...ORGANIZATION_TYPES].map((type) => <option key={type} value={type}>{labels.types[type] ?? type}</option>)}
                                </SelectField>
                                {form.type === OTHER && <TextField label={`${labels.otherType} *`} maxLength={1000} error={errors.otherType} {...field("otherType")} />}
                            </div>
                            <TextField label={labels.website} {...field("website")} />
                            <NotesTextAreaField label={labels.about} description={labels.aboutHint} extraDescription={labels.aboutLimit} maxLength={1000} {...field("description")} />
                        </div>
                        <div className="mt-[1.875rem] grid grid-cols-2 gap-x-[1.625rem] down-800:grid-cols-1 down-800:gap-y-[1.125rem]">
                            <TextField label={labels.vk} icon="/web/icons/social-mini/vk-mini-logo.svg" type="url" {...field("vk")} />
                            <TextField label="Telegram" icon="/web/icons/social-mini/telegram-mini-logo.svg" type="url" {...field("telegram")} />
                            <p className="col-span-full mt-3 text-[0.8125rem] text-caption">{labels.bannedNotice}</p>
                        </div>
                    </div>
                    <div className="flex w-60 shrink-0 flex-col items-center gap-6 down-lg:w-full">
                        <div>
                            <AvatarInput
                                src={mediaUrl(form.avatar, "medium")}
                                href={organizationId ? organizationHref.replace("{id}", organizationId) : infoHref}
                                labels={{ view: labels.viewProfile, maxSize: labels.maxSize, choose: labels.choosePhoto }}
                                onFile={(file) => void upload(file)}
                            />
                            {form.avatar && (
                                <button type="button" onClick={() => set({ avatar: null })} className="w-full cursor-pointer border-0 bg-transparent text-center text-error">
                                    {labels.deleteImage}
                                </button>
                            )}
                        </div>
                        {aside}
                    </div>
                </div>
                <div><button type="submit" disabled={busy} className={blueButton}>{labels.save}</button></div>
            </form>
        </>
    );
}
