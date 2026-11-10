/**
 * Профиль из API ↔ поля формы «Обо мне» и тело PATCH /api/v1/profile. PATCH перезаписывает профиль
 * целиком, поэтому тело всегда со всеми полями (вынесено из ProfileInfoForm 06.11.2026 — нужно и
 * окну отклика, где новичок добавляет имя и фото).
 */
export interface ProfileForm {
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

export type Profile = Record<string, unknown> & { id: string; email?: string | null; isVerified?: boolean };

const text = (value: unknown) => (typeof value === "string" ? value : "");

/** Профиль из API → поля формы; дата рождения приходит строкой d.m.Y */
export function toForm(profile: Profile): ProfileForm {
    const [day = "", month = "", year = ""] = text(profile.birthDate).split(/[.-]/);
    const image = profile.image as ProfileForm["image"] | undefined;
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
export function toBody(form: ProfileForm) {
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
        // Facebook и Instagram в форме не показываем (Meta запрещена в РФ), но прежние значения не стираем
        facebook: nullable(form.facebook),
        telegram: nullable(form.telegram),
        instagram: nullable(form.instagram),
        imageId: form.image?.id ?? null,
    };
}

/** Ни роли волонтёра, ни организации — новичок, который ещё не откликался и не создавал вакансий */
export function isNewcomer(profile: Record<string, unknown>): boolean {
    return !profile.volunteer && !profile.hostId;
}

