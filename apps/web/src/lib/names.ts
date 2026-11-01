import type { Translate } from "@/i18n/dictionary";

/** «Имя Фамилия»; ни того, ни другого — «Анонимный пользователь» (как useGetFullName старого фронта). */
export function fullName(firstName: string | null | undefined, lastName: string | null | undefined, t: Translate): string {
    const name = `${firstName || ""} ${lastName || ""}`.trim();
    return name || t("Анонимный пользователь");
}

/** «Страна, Город» или что есть (как getFullAddress старого фронта). */
export function fullAddress(city?: string | null, country?: string | null): string {
    if (country && city) return `${country}, ${city}`;
    return country || city || "";
}
