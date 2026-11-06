"use client";

import { type FormEvent, type ReactNode, useEffect, useState } from "react";

import { AuthToast } from "@/components/auth/AuthToast";
import { blueButton, SelectField, TextAreaField, TextField } from "@/components/form/fields";
import { useSession } from "@/components/session/SessionProvider";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Loading } from "@/components/ui/Loading";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { shrinkImage } from "@/lib/shrinkImage";
import { MAX_UPLOAD_SIZE, uploadMedia } from "@/lib/uploadMedia";

export interface ProfileInfoLabels {
    firstName: string;
    lastName: string;
    birthDate: string;
    months: string[];
    gender: string;
    genders: { male: string; female: string; other: string };
    genderNone: string;
    datePlaceholders: { day: string; month: string; year: string };
    country: string;
    city: string;
    language: string;
    phone: string;
    aboutMe: string;
    aboutHint: string;
    socialHint: string;
    save: string;
    discard: string;
    unsaved: string;
    next: string;
    saved: string;
    saveError: string;
    viewProfile: string;
    maxSize: string;
    photo: { upload: string; change: string; uploading: string; saved: string; deleted: string; deleteConfirm: string; delete: string; keep: string; tooLarge: string; notImage: string; error: string };
    verifyText: string;
    verify: string;
    errors: { day: string; month: string; year: string; dayInvalid: string; yearMin: string; yearMax: string };
}

interface Form {
    firstName: string;
    lastName: string;
    day: string;
    month: string;
    year: string;
    gender: string;
    country: string;
    city: string;
    locale: string;
    phone: string;
    aboutMe: string;
    vk: string;
    facebook: string;
    instagram: string;
    telegram: string;
    image: { id: string; contentUrl: string; thumbnails?: unknown } | null;
}

type Profile = Record<string, unknown> & { id: string; email?: string | null; isVerified?: boolean };

const text = (value: unknown) => (typeof value === "string" ? value : "");

/** Профиль из API → поля формы; дата рождения приходит строкой d.m.Y */
function toForm(profile: Profile): Form {
    const [day = "", month = "", year = ""] = text(profile.birthDate).split(/[.-]/);
    const image = profile.image as Form["image"] | undefined;
    return {
        firstName: text(profile.firstName),
        lastName: text(profile.lastName),
        day: day ? String(Number(day)) : "",
        month: month ? String(Number(month)) : "",
        year,
        gender: text(profile.gender),
        country: text(profile.country),
        city: text(profile.city),
        locale: text(profile.locale) || "ru",
        phone: text(profile.phone),
        aboutMe: text(profile.aboutMe),
        vk: text(profile.vk),
        facebook: text(profile.facebook),
        instagram: text(profile.instagram),
        telegram: text(profile.telegram),
        image: image?.id ? image : null,
    };
}

const nullable = (value: string) => value.trim() || null;

/** Тело PATCH /profile: он перезаписывает профиль целиком, поэтому всегда все поля */
function toBody(form: Form) {
    const birthDate = form.day && form.month && form.year
        ? `${form.day.padStart(2, "0")}.${form.month.padStart(2, "0")}.${form.year}`
        : null;
    return {
        locale: form.locale,
        firstName: nullable(form.firstName),
        lastName: nullable(form.lastName),
        birthDate,
        phone: nullable(form.phone),
        city: nullable(form.city),
        country: nullable(form.country),
        aboutMe: nullable(form.aboutMe),
        gender: nullable(form.gender),
        vk: nullable(form.vk),
        facebook: nullable(form.facebook),
        telegram: nullable(form.telegram),
        instagram: nullable(form.instagram),
        imageId: form.image?.id ?? null,
    };
}

/** Есть ли несохранённые правки полей (фото сохраняется сразу и сюда не входит) */
export function hasChanges(saved: Form, form: Form): boolean {
    return (Object.keys(form) as (keyof Form)[]).some((key) => key !== "image" && form[key] !== saved[key]);
}

/**
 * «Обо мне» (ProfileInfoForm старого фронта, переделано по замечаниям владельца 06.11.2026).
 * Форма всегда редактируемая: «Сохранить» и «Отменить изменения» появляются, когда есть
 * правки, при уходе с несохранёнными правками браузер переспросит. Фото сохраняется сразу
 * после загрузки (раньше — только вместе с формой и терялось, если уйти): превью сразу,
 * перед отправкой уменьшается до 1024 px, в PATCH уходит последний сохранённый профиль
 * с новым фото — несохранённые правки полей не записываются молча.
 */
export function ProfileInfoForm({ volunteerHref, preferencesHref, verifyHref, aside, labels }: {
    /** Публичная страница с {id} */
    volunteerHref: string;
    preferencesHref: string;
    verifyHref: string;
    aside?: ReactNode;
    labels: ProfileInfoLabels;
}) {
    const session = useSession();
    const [form, setForm] = useState<Form | null>(null);
    const [saved, setSaved] = useState<Form | null>(null);
    const [errors, setErrors] = useState<Partial<Record<"day" | "month" | "year", string>>>({});
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const [busy, setBusy] = useState(false);
    const [photo, setPhoto] = useState<{ preview: string | null; busy: boolean; error: string | null }>({ preview: null, busy: false, error: null });
    const [askDelete, setAskDelete] = useState(false);

    const profile = session.profile as Profile | null;
    useEffect(() => {
        // Форма заполняется данными профиля, когда сессия их загрузила
        if (profile && !form) {
            const initial = toForm(profile);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm(initial);
            setSaved(initial);
        }
    }, [profile, form]);

    const dirty = !!form && !!saved && hasChanges(saved, form);
    useEffect(() => {
        if (!dirty) return;
        const warn = (event: BeforeUnloadEvent) => event.preventDefault();
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [dirty]);
    useEffect(() => () => {
        if (photo.preview) URL.revokeObjectURL(photo.preview);
    }, [photo.preview]);

    if (!profile || !form || !saved) return <Loading className="min-h-[300px]" />;

    const set = (patch: Partial<Form>) => setForm({ ...form, ...patch });
    const field = (name: keyof Omit<Form, "image">) => ({
        value: form[name],
        onChange: (event: { target: { value: string } }) => set({ [name]: event.target.value } as Partial<Form>),
    });

    const validate = () => {
        const next: typeof errors = {};
        const filled = form.day || form.month || form.year;
        if (filled) {
            const year = Number(form.year);
            if (!form.day) next.day = labels.errors.day;
            if (!form.month) next.month = labels.errors.month;
            if (!form.year) next.year = labels.errors.year;
            else if (year < 1900) next.year = labels.errors.yearMin;
            else if (year > new Date().getFullYear()) next.year = labels.errors.yearMax;
            if (form.day && form.month && form.year) {
                const date = new Date(year, Number(form.month) - 1, Number(form.day));
                if (date.getDate() !== Number(form.day)) next.day = labels.errors.dayInvalid;
            }
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    /** PATCH профиля; при успехе — новый профиль в сессию (шапка) */
    const patch = async (next: Form) => {
        const api = browserApi(session.token);
        const { error } = await api.PATCH("/api/v1/profile", { body: toBody(next) as never });
        if (error) throw new Error("save");
        // PATCH отвечает пустым объектом — свежий профиль (с новым фото) берём отдельно, для шапки; не вышло — не беда
        const fresh = await api.GET("/api/v1/profile").catch(() => null);
        if (fresh?.data) session.updateProfile(fresh.data);
    };

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validate()) return;
        setBusy(true);
        try {
            await patch(form);
            setSaved(form);
            setToast({ text: labels.saved, ok: true });
        } catch {
            setToast({ text: labels.saveError, ok: false });
        } finally {
            setBusy(false);
        }
    };

    /** Фото — в сохранённый профиль сразу, поля формы с правками не трогаем */
    const savePhoto = async (image: Form["image"]) => {
        await patch({ ...saved, image });
        setSaved({ ...saved, image });
        setForm((current) => (current ? { ...current, image } : current));
    };

    const upload = async (file: File | undefined) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setPhoto({ preview: null, busy: false, error: labels.photo.notImage });
            return;
        }
        const preview = URL.createObjectURL(file);
        setPhoto({ preview, busy: true, error: null });
        const small = await shrinkImage(file);
        if (small.size > MAX_UPLOAD_SIZE) {
            setPhoto({ preview: null, busy: false, error: labels.photo.tooLarge });
            return;
        }
        try {
            const media = await uploadMedia(small, session.token);
            await savePhoto({ id: media.id, contentUrl: media.contentUrl, thumbnails: media.thumbnails });
            setPhoto({ preview, busy: false, error: null });
            setToast({ text: labels.photo.saved, ok: true });
        } catch {
            setPhoto({ preview: null, busy: false, error: labels.photo.error });
        }
    };

    const removePhoto = async () => {
        setPhoto({ preview: null, busy: true, error: null });
        try {
            await savePhoto(null);
            setPhoto({ preview: null, busy: false, error: null });
            setToast({ text: labels.photo.deleted, ok: true });
        } catch {
            setPhoto({ preview: null, busy: false, error: labels.photo.error });
        } finally {
            setAskDelete(false);
        }
    };

    const avatar = photo.preview ?? mediaUrl(form.image, "medium");
    const months = labels.months;
    const hasPhoto = !!form.image || !!photo.preview;
    return (
        <>
            {toast && (toast.ok
                ? <SuccessToast text={toast.text} onClose={() => setToast(null)} />
                : <AuthToast text={toast.text} onClose={() => setToast(null)} />)}
            <ConfirmDialog open={askDelete} text={labels.photo.deleteConfirm} confirm={labels.photo.delete} cancel={labels.photo.keep} busy={photo.busy} onConfirm={() => void removePhoto()} onClose={() => setAskDelete(false)} />
            {profile.isVerified === false && (
                <div className="mb-6 flex flex-wrap items-center gap-4 rounded-[10px] bg-field px-5 py-4">
                    <p className="text-[14px]">{labels.verifyText}</p>
                    <a href={verifyHref} className="rounded-[10px] bg-primary px-[50px] py-3.5 text-[1rem] leading-[1.375rem] text-white hover:bg-primary-hover">{labels.verify}</a>
                </div>
            )}
            <div className="flex gap-5 down-lg:flex-col-reverse down-lg:flex-wrap down-lg:pt-[15px]">
                <form onSubmit={submit} className="relative flex min-w-0 flex-1 flex-col gap-10">
                    <div className="flex flex-col gap-[30px]">
                        <div className="flex gap-6 down-lg:flex-wrap">
                            <TextField label={labels.firstName} autoComplete="given-name" {...field("firstName")} />
                            <TextField label={labels.lastName} autoComplete="family-name" {...field("lastName")} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[14px] leading-none text-caption">{labels.birthDate}</span>
                            <div className="grid w-1/2 grid-cols-[minmax(84px,1fr)_2fr_minmax(84px,1fr)] items-baseline gap-3.5 pb-2 down-lg:w-full">
                                <SelectField aria-label={`${labels.birthDate}: ${labels.datePlaceholders.day}`} error={errors.day} {...field("day")}>
                                    <option value="">{labels.datePlaceholders.day}</option>
                                    {Array.from({ length: 31 }, (_, index) => <option key={index} value={index + 1}>{index + 1}</option>)}
                                </SelectField>
                                <SelectField aria-label={`${labels.birthDate}: ${labels.datePlaceholders.month}`} error={errors.month} {...field("month")}>
                                    <option value="">{labels.datePlaceholders.month}</option>
                                    {months.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}
                                </SelectField>
                                <TextField aria-label={`${labels.birthDate}: ${labels.datePlaceholders.year}`} placeholder={labels.datePlaceholders.year} inputMode="numeric" maxLength={4} autoComplete="bday-year" error={errors.year} {...field("year")} />
                            </div>
                        </div>
                        <SelectField label={labels.gender} className="max-w-[50%] down-lg:max-w-none" {...field("gender")}>
                            <option value="">{labels.genderNone}</option>
                            <option value="male">{labels.genders.male}</option>
                            <option value="female">{labels.genders.female}</option>
                            <option value="other">{labels.genders.other}</option>
                        </SelectField>
                        <div className="grid w-full grid-cols-2 gap-6 down-lg:grid-cols-1">
                            <TextField label={labels.country} autoComplete="country-name" {...field("country")} />
                            <TextField label={labels.city} autoComplete="address-level2" {...field("city")} />
                            <SelectField label={labels.language} {...field("locale")}>
                                <option value="ru">Русский</option>
                                <option value="en">English</option>
                                <option value="es">Español</option>
                            </SelectField>
                        </div>
                        <div className="flex max-w-[624px] gap-6 down-lg:flex-wrap">
                            <TextField label="E-mail" value={profile.email ?? ""} disabled readOnly />
                            <TextField label={labels.phone} type="tel" autoComplete="tel" {...field("phone")} />
                        </div>
                        <TextAreaField label={labels.aboutMe} maxLength={1000} description={`${labels.aboutHint} · ${form.aboutMe.length}/1000`} {...field("aboutMe")} />
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
                            <TextField label="VK" placeholder={labels.socialHint} icon="/web/icons/social-mini/vk-mini-logo.svg" {...field("vk")} />
                            <TextField label="Facebook" placeholder={labels.socialHint} icon="/web/icons/social-mini/facebook-mini-logo.svg" {...field("facebook")} />
                            <TextField label="Instagram" placeholder={labels.socialHint} icon="/web/icons/social-mini/instagram-mini-logo.svg" {...field("instagram")} />
                            <TextField label="Telegram" placeholder={labels.socialHint} icon="/web/icons/social-mini/telegram-mini-logo.svg" {...field("telegram")} />
                        </div>
                    </div>
                    {/* Пока есть правки, кнопки прилипают к низу экрана — не нужно листать до конца формы */}
                    <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${dirty ? "sticky bottom-0 z-10 -mx-4 border-t border-accent-bg bg-white/95 px-4 py-3 backdrop-blur" : ""}`}>
                        <button type="submit" disabled={!dirty || busy} className={`${blueButton} disabled:cursor-default disabled:opacity-50`}>{labels.save}</button>
                        {dirty && (
                            <>
                                <button type="button" onClick={() => { setForm({ ...saved, image: form.image }); setErrors({}); }} className="cursor-pointer text-[15px] text-primary hover:underline">{labels.discard}</button>
                                <span className="text-[14px] text-caption down-sm:w-full">{labels.unsaved}</span>
                            </>
                        )}
                        {!dirty && <a href={preferencesHref} className="text-[15px] font-medium text-primary no-underline hover:underline">{labels.next}&nbsp;→</a>}
                    </div>
                </form>
                <div className="flex flex-col items-center gap-6">
                    <div className="flex w-[182px] flex-col items-center">
                        <a href={volunteerHref.replace("{id}", profile.id)} className="relative text-[1rem] font-semibold text-primary no-underline before:absolute before:top-[102%] before:h-[1.7px] before:w-full before:bg-primary">
                            {labels.viewProfile}
                        </a>
                        <label className={`group relative mt-8 flex h-[172px] w-[172px] items-center justify-center overflow-hidden rounded-full bg-primary down-sm:mt-4 ${photo.busy ? "cursor-wait" : "cursor-pointer"}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element -- аватар, превью до загрузки или значок фотоаппарата */}
                            <img loading="lazy" decoding="async" src={avatar || "/web/images/default-image-file.png"} alt="" className={avatar ? "absolute h-full w-full rounded-[inherit] object-cover" : ""} />
                            {photo.busy ? (
                                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 text-[13px] font-medium text-white">
                                    <span aria-hidden className="h-7 w-7 animate-spin rounded-full border-[3px] border-white/40 border-t-white" />
                                    {labels.photo.uploading}
                                </span>
                            ) : (
                                <span className="absolute inset-x-0 bottom-0 bg-black/50 py-2 text-center text-[13px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 down-lg:opacity-100">
                                    {hasPhoto ? labels.photo.change : labels.photo.upload}
                                </span>
                            )}
                            <input type="file" accept="image/*" disabled={photo.busy} aria-label={hasPhoto ? labels.photo.change : labels.photo.upload} className="sr-only" onChange={(event) => { void upload(event.target.files?.[0]); event.target.value = ""; }} />
                        </label>
                        <span role={photo.error ? "alert" : undefined} className={`mt-3 text-center text-[12px] leading-[130%] ${photo.error ? "text-error" : "text-[#82949F]"}`}>{photo.error ?? labels.maxSize}</span>
                        {form.image && !photo.busy && (
                            <button type="button" onClick={() => setAskDelete(true)} className="mt-1 cursor-pointer border-0 bg-transparent text-center text-[14px] text-error hover:underline">
                                {labels.photo.delete}
                            </button>
                        )}
                    </div>
                    {aside}
                </div>
            </div>
        </>
    );
}

function SuccessToast({ text, onClose }: { text: string; onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);
    return (
        <div className="fixed top-[10%] left-1/2 z-[51] min-w-[20vh] -translate-x-1/2 font-medium tracking-[.6px] text-white">
            <div role="status" onClick={onClose} className="flex cursor-pointer items-center justify-center rounded-[30px] bg-[#62eb50] px-8 py-4 shadow-[6px_8px_16px_0_rgba(34,60,80,0.2)]">{text}</div>
        </div>
    );
}
