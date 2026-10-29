import "server-only";

import type { components } from "@goodsurfing/api";

import type { Locale } from "@/i18n/config";

import { OPTIONAL_BLOCK_TIMEOUT_MS, serverApi } from "./api";
import { type OfferPerson, type OfferReview, type Page, toReviewClient as toReview } from "./offerReview";

export type { OfferPerson, OfferReview, Page };

export type OfferDetail = components["schemas"]["ElementResult8"];

export type OfferResult =
    | { kind: "ok"; offer: OfferDetail }
    | { kind: "notFound" }
    | { kind: "error" };

/**
 * Вакансия для страницы (анонимно): общее для всех. То, что зависит от
 * вошедшего (откликнуться, редактировать, оставить отзыв), браузер
 * дозапрашивает сам — страница остаётся одинаковой и кэшируется.
 */
export async function getOffer(locale: Locale, id: string): Promise<OfferResult> {
    if (!/^\d+$/.test(id)) return { kind: "notFound" };
    try {
        const { data, response } = await serverApi(locale).GET("/api/v1/vacancy/{id}", {
            params: { path: { id: Number(id) } },
            signal: AbortSignal.timeout(8000),
        });
        if (response.status === 404) return { kind: "notFound" };
        // Бэкенд отдаёт null у незаполненных шагов, хотя в схеме они обязательные
        return data ? { kind: "ok", offer: data } : { kind: "error" };
    } catch {
        return { kind: "error" };
    }
}

export const PARTICIPANTS_PER_PAGE = 6;
export const REVIEWS_PER_PAGE = 5;

/** Первая страница участников; null — API недоступен (блок покажет ошибку). */
export async function getOfferParticipants(locale: Locale, id: string): Promise<Page<OfferPerson> | null> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/profile/vacancy-participant/list/{vacancyId}", {
            params: { path: { vacancyId: Number(id) }, query: { page: 1, limit: PARTICIPANTS_PER_PAGE } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        if (!data) return null;
        return { items: data.data ?? [], total: data.pagination?.total ?? 0 };
    } catch {
        return null;
    }
}

/** Первая страница отзывов — на сервере, чтобы их видели поисковики. */
export async function getOfferReviews(locale: Locale, id: string): Promise<Page<OfferReview> | null> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/review-vacancy/list/{vacancyId}", {
            params: { path: { vacancyId: Number(id) }, query: { page: 1, limit: REVIEWS_PER_PAGE } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        if (!data) return null;
        return { items: (data.data ?? []).map(toReview), total: data.pagination?.total ?? 0 };
    } catch {
        return null;
    }
}

/** Баннер на странице вакансии (задаётся в админке); необязательный блок. */
export async function getOfferBanner(locale: Locale): Promise<{ url: string; description: string; image?: string } | null> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/marketing-banner/element/{type}", {
            params: { path: { type: "VACANCY_PAGE" } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        if (!data?.url || !data.description) return null;
        const image = (data as { image?: { contentUrl?: string } | null }).image?.contentUrl;
        return { url: data.url, description: data.description, image };
    } catch {
        return null;
    }
}

/**
 * SVG-иконка с API (навыки, жильё, питание) для вставки в разметку: старый
 * фронт вставлял её как есть (react-svg) и перекрашивал через fill. Нет
 * иконки или не SVG — null, вместо неё ничего не рисуем.
 */
export async function inlineSvg(url: string | null | undefined): Promise<string | null> {
    if (!url) return null;
    try {
        const response = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS) });
        if (!response.ok) return null;
        const text = await response.text();
        const start = text.indexOf("<svg");
        if (start < 0) return null;
        // Скрипты и обработчики событий из загруженного файла не пропускаем
        return text.slice(start)
            .replace(/<script[\s\S]*?<\/script>/gi, "")
            .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, "")
            .replace(/\s(width|height)="[^"]*"/g, "");
    } catch {
        return null;
    }
}
