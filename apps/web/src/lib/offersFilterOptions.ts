import "server-only";

import type { Locale } from "@/i18n/config";
import type { Translate } from "@/i18n/dictionary";

import { OPTIONAL_BLOCK_TIMEOUT_MS, serverApi } from "./api";

export interface FilterCategory { id: number; name: string; color: string }
export interface FilterLanguage { value: string; label: string }

/** Направления деятельности для фильтра каталога (GET /category). */
export async function getFilterCategories(locale: Locale): Promise<FilterCategory[]> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/category", {
            params: { query: { lang: locale } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        return (data ?? []).map((category) => ({ id: category.id, name: category.name, color: category.color }));
    } catch {
        return [];
    }
}

// Как useAllLangs старого фронта (без «Не важен»): значение — то, что хранит бэкенд
const LANGUAGES: [string, string][] = [
    ["English", "Английский"], ["Русский", "Русский"], ["Español", "Испанский"], ["中文", "Китайский"],
    ["Deutsch", "Немецкий"], ["Italiano", "Итальянский"], ["Français", "Французский"], ["Português", "Португальский"],
    ["Türkçe", "Турецкий"], ["العربية", "Арабский"], ["Svenska", "Шведский"], ["Dansk", "Датский"],
    ["Norsk", "Норвежский"], ["Українська", "Украинский"], ["עברית", "Иврит"],
];

export function filterLanguages(tOffer: Translate): FilterLanguage[] {
    return LANGUAGES.map(([value, key]) => ({ value, label: tOffer(`whoNeeds.${key}`) }));
}
