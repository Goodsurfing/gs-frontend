import "server-only";

import type { components } from "@goodsurfing/api";

import type { Locale } from "@/i18n/config";

import { OPTIONAL_BLOCK_TIMEOUT_MS, serverApi } from "./api";
import { ApiUnavailableError } from "./apiUnavailable";

export type OfferCardData = components["schemas"]["ListResult6"];

import { localizeCard, vacancyLang } from "./offerLocale";

export { localizeCard, vacancyLang };

/** Сколько вакансий в слайдере «Интересные вакансии» (как SLIDER_OFFERS_LIMIT старого фронта) */
export const SLIDER_OFFERS_LIMIT = 10;

/**
 * Вакансии категорий для слайдера, по рекомендации. Необязательный блок:
 * API недоступен — пустой список.
 */
export async function getOffersByCategories(locale: Locale, categoryIds: number[]): Promise<OfferCardData[]> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/vacancy", {
            params: { query: { "categoryIds[]": categoryIds, sort: "recommendation", fields: "card", limit: SLIDER_OFFERS_LIMIT, ...vacancyLang(locale) } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        return (data?.data ?? []).slice(0, SLIDER_OFFERS_LIMIT).map(localizeCard);
    } catch {
        return [];
    }
}

/**
 * Открытые вакансии направления для посадочной страницы (`/volunteering/<slug>`):
 * только с будущими датами или «круглый год» (hidePassed), до 24, сначала
 * рекомендованные. Сколько всего — для строки «N открытых вакансий».
 * Список — главное содержимое страницы: ждём дольше необязательных блоков, а при
 * сбое API бросаем ApiUnavailableError, чтобы пустая страница не попала в кэш.
 */
export async function getOpenOffersOfCategory(locale: Locale, categoryId: number): Promise<{ offers: OfferCardData[]; total: number }> {
    let result;
    try {
        result = await serverApi(locale).GET("/api/v1/vacancy", {
            params: { query: { "categoryIds[]": [categoryId], hidePassed: true, sort: "recommendation", fields: "card", limit: 24, ...vacancyLang(locale) } as never },
            signal: AbortSignal.timeout(LANDING_TIMEOUT_MS),
        });
    } catch {
        throw new ApiUnavailableError(`вакансии направления ${categoryId}`);
    }
    if (!result.data) throw new ApiUnavailableError(`вакансии направления ${categoryId}`);
    const offers = ((result.data.data ?? []) as OfferCardData[]).map(localizeCard);
    return { offers, total: (result.data as { pagination?: { total?: number } }).pagination?.total ?? offers.length };
}

const LANDING_TIMEOUT_MS = 8000;
