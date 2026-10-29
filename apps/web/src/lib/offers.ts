import "server-only";

import type { components } from "@goodsurfing/api";

import type { Locale } from "@/i18n/config";

import { OPTIONAL_BLOCK_TIMEOUT_MS, serverApi } from "./api";

export type OfferCardData = components["schemas"]["ListResult6"];

/** Сколько вакансий в слайдере «Интересные вакансии» (как SLIDER_OFFERS_LIMIT старого фронта) */
export const SLIDER_OFFERS_LIMIT = 10;

/**
 * Вакансии категорий для слайдера, по рекомендации. Необязательный блок:
 * API недоступен — пустой список.
 */
export async function getOffersByCategories(locale: Locale, categoryIds: number[]): Promise<OfferCardData[]> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/vacancy", {
            params: { query: { "categoryIds[]": categoryIds, sort: "recommendation", fields: "card", limit: SLIDER_OFFERS_LIMIT } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        return (data?.data ?? []).slice(0, SLIDER_OFFERS_LIMIT);
    } catch {
        return [];
    }
}
