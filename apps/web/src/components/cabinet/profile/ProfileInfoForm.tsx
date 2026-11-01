"use client";

import { type FormEvent, type ReactNode, useEffect, useState } from "react";

import { AuthToast } from "@/components/auth/AuthToast";
import { blueButton, SelectField, TextAreaField, TextField } from "@/components/form/fields";
import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { API_URL, browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";

export interface ProfileInfoLabels {
    firstName: string;
    lastName: string;
    birthDate: string;
    months: string[];
    gender: string;
    genders: { male: string; female: string; other: string };
    country: string;
    city: string;
    language: string;
    phone: string;
    aboutMe: string;
    aboutHint: string;
    save: string;
    edit: string;
    cancel: string;
    next: string;
    saved: string;
    viewProfile: string;
    maxSize: string;
    deleteImage: string;
    uploadError: string;
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

/**
 * «Обо мне» (ProfileInfoForm старого фронта). Форма заблокирована, пока не
 * нажали «Редактировать» (после сохранения снова блокируется); аватар
 * сохраняется вместе с формой. PATCH /profile перезаписывает профиль
 * целиком — отправляются все поля, включая картинку.
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
    const [locked, setLocked] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<"day" | "month" | "year", string>>>({});
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const [busy, setBusy] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    const profile = session.profile as Profile | null;
    useEffect(() => {
        // Форма заполняется данными профиля, когда сессия их загрузила
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (profile && !form) setForm(toForm(profile));
    }, [profile, form]);

    if (!profile || !form) return <Loading className="min-h-[300px]" />;

    const set = (patch: Partial<Form>) => setForm({ ...form, ...patch });
    const field = (name: keyof Omit<Form, "image">) => ({
        value: form[name],
        disabled: locked,
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

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validate()) return;
        setBusy(true);
        const birthDate = form.day && form.month && form.year
            ? `${form.day.padStart(2, "0")}.${form.month.padStart(2, "0")}.${form.year}`
            : null;
        try {
            const { error } = await browserApi(session.token).PATCH("/api/v1/profile", {
                body: {
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
                } as never,
            });
            if (error) throw new Error("save");
            setToast({ text: labels.saved, ok: true });
            setLocked(true);
        } catch {
            setToast({ text: labels.uploadError, ok: false });
        } finally {
            setBusy(false);
        }
    };

    const upload = async (file: File | undefined) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setSizeError(true);
            return;
        }
        setSizeError(false);
        try {
            const body = new FormData();
            body.append("file", file);
            const response = await fetch(`${API_URL}/api/v1/media_objects`, {
                method: "POST",
                credentials: "include",
                headers: { Accept: "application/ld+json", ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}) },
                body,
            });
            if (!response.ok) throw new Error(String(response.status));
            const media = await response.json() as Form["image"];
            set({ image: media });
            setLocked(false);
        } catch {
            setToast({ text: labels.uploadError, ok: false });
        }
    };

    const avatar = mediaUrl(form.image, "medium");
    const months = labels.months;
    return (
        <>
            {toast && (toast.ok
                ? <SuccessToast text={toast.text} onClose={() => setToast(null)} />
                : <AuthToast text={toast.text} onClose={() => setToast(null)} />)}
            {profile.isVerified === false && (
                <div className="mb-6 flex flex-wrap items-center gap-4 rounded-[10px] bg-field px-5 py-4">
                    <p className="text-[14px]">{labels.verifyText}</p>
                    <a href={verifyHref} className="rounded-[10px] bg-primary px-[50px] py-3.5 text-[1rem] leading-[1.375rem] text-white hover:bg-primary-hover">{labels.verify}</a>
                </div>
            )}
            <div className="flex gap-5 down-lg:flex-col-reverse down-lg:flex-wrap down-lg:pt-[15px]">
                <form onSubmit={submit} className="relative flex flex-col gap-[60px]">
                    <div className="flex flex-col gap-[30px]">
                        <div className="flex gap-6 down-lg:flex-wrap">
                            <TextField label={labels.firstName} {...field("firstName")} />
                            <TextField label={labels.lastName} {...field("lastName")} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[14px] leading-none text-caption">{labels.birthDate}</span>
                            <div className="grid w-1/2 grid-cols-[19%_48%_27%] items-baseline gap-3.5 pb-2 down-lg:w-full">
                                <SelectField aria-label={labels.birthDate} error={errors.day} {...field("day")}>
                                    <option value="" />
                                    {Array.from({ length: 31 }, (_, index) => <option key={index} value={index + 1}>{index + 1}</option>)}
                                </SelectField>
                                <SelectField aria-label={labels.birthDate} error={errors.month} {...field("month")}>
                                    <option value="" />
                                    {months.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}
                                </SelectField>
                                <TextField aria-label={labels.birthDate} type="number" inputMode="numeric" error={errors.year} {...field("year")} />
                            </div>
                        </div>
                        <SelectField label={labels.gender} className="max-w-[50%] down-lg:max-w-none" {...field("gender")}>
                            <option value="" />
                            <option value="male">{labels.genders.male}</option>
                            <option value="female">{labels.genders.female}</option>
                            <option value="other">{labels.genders.other}</option>
                        </SelectField>
                        <div className="flex w-full flex-wrap gap-6 [&>*]:w-[300px] down-lg:[&>*]:w-full">
                            <TextField label={labels.country} {...field("country")} />
                            <TextField label={labels.city} {...field("city")} />
                            <SelectField label={labels.language} {...field("locale")}>
                                <option value="ru">Русский</option>
                                <option value="en">English</option>
                                <option value="es">Español</option>
                            </SelectField>
                        </div>
                        <div className="flex max-w-[624px] gap-6 down-lg:flex-wrap">
                            <TextField label="E-mail" value={profile.email ?? ""} disabled readOnly />
                            <TextField label={labels.phone} type="tel" {...field("phone")} />
                        </div>
                        <TextAreaField label={labels.aboutMe} maxLength={1000} description={labels.aboutHint} {...field("aboutMe")} />
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
                            <TextField label="VK" icon="/web/icons/social-mini/vk-mini-logo.svg" {...field("vk")} />
                            <TextField label="Facebook" icon="/web/icons/social-mini/facebook-mini-logo.svg" {...field("facebook")} />
                            <TextField label="Instagram" icon="/web/icons/social-mini/instagram-mini-logo.svg" {...field("instagram")} />
                            <TextField label="Telegram" icon="/web/icons/social-mini/telegram-mini-logo.svg" {...field("telegram")} />
                        </div>
                    </div>
                    <div><button type="submit" disabled={locked || busy} className={blueButton}>{labels.save}</button></div>
                    <button type="button" onClick={() => setLocked(!locked)} className="absolute top-0 right-0 cursor-pointer border-0 bg-inherit px-1.5 py-px text-[16px] leading-[120%] text-primary outline-none">
                        {locked ? labels.edit : labels.cancel}
                    </button>
                    <div><a href={preferencesHref} className={`${blueButton} w-fit`}>{labels.next}</a></div>
                </form>
                <div className="flex flex-col items-center gap-6">
                    <div className="flex max-w-[182px] flex-col justify-end">
                        <div className="flex justify-center">
                            <a href={volunteerHref.replace("{id}", profile.id)} className="relative text-[1rem] font-semibold text-primary no-underline before:absolute before:top-[102%] before:h-[1.7px] before:w-full before:bg-primary">
                                {labels.viewProfile}
                            </a>
                        </div>
                        <label className="relative mt-[2.8rem] flex h-[172px] w-[172px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary down-sm:mt-0">
                            {/* eslint-disable-next-line @next/next/no-img-element -- аватар или значок фотоаппарата */}
                            <img src={avatar || "/web/images/default-image-file.png"} alt="profile-pic" className={avatar ? "absolute h-full w-full rounded-[inherit] object-cover" : ""} />
                            <input type="file" accept="image/*" className="hidden" onChange={(event) => { void upload(event.target.files?.[0]); event.target.value = ""; }} />
                        </label>
                        <span className={`mt-[.9rem] text-center text-[.625rem] ${sizeError ? "text-[red]" : "text-[#82949F]"}`}>{labels.maxSize}</span>
                        {form.image && (
                            <button type="button" onClick={() => { set({ image: null }); setLocked(false); }} className="w-full cursor-pointer border-0 bg-transparent text-center text-error">
                                {labels.deleteImage}
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
