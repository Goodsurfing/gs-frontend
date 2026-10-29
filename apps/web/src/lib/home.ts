import "server-only";

import type { components } from "@goodsurfing/api";

import type { Locale } from "@/i18n/config";

import { OPTIONAL_BLOCK_TIMEOUT_MS, serverApi } from "./api";
import { type OfferCardData, SLIDER_OFFERS_LIMIT } from "./offers";

export interface HomeCategory { id: number; name: string; image?: string }

/** Плитки направлений на первом экране: первые семь категорий (ActivityContainer старого фронта) */
export async function getHomeCategories(locale: Locale): Promise<HomeCategory[]> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/category", {
            params: { query: { lang: locale } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        return (data ?? []).slice(0, 7).map((category) => ({
            id: category.id,
            name: category.name,
            image: (category as { imagePath?: string }).imagePath,
        }));
    } catch {
        return [];
    }
}

/**
 * «Интересные вакансии» для гостя: подборка админки (isFeatured), если она
 * пуста — по рекомендации (OffersSlider старого фронта). Подборку по
 * любимым категориям вошедшего браузер подставляет сам.
 */
export async function getFeaturedOffers(locale: Locale): Promise<OfferCardData[]> {
    const load = async (query: { isFeatured?: boolean; sort?: "recommendation" }) => {
        const { data } = await serverApi(locale).GET("/api/v1/vacancy", {
            params: { query: { ...query, fields: "card", limit: SLIDER_OFFERS_LIMIT } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        return (data?.data ?? []).slice(0, SLIDER_OFFERS_LIMIT);
    };
    try {
        const featured = await load({ isFeatured: true });
        return featured.length > 0 ? featured : await load({ sort: "recommendation" });
    } catch {
        return [];
    }
}

export type FeaturedReview = components["schemas"]["FeaturedResult"];

/** Отзывы для витрины на главной — только с фото (ReviewsContainer старого фронта) */
export async function getFeaturedReviews(locale: Locale): Promise<FeaturedReview[]> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/review-vacancy/featured", {
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        return (data ?? []).filter((review) => (review.images ?? []).length > 0);
    } catch {
        return [];
    }
}

/** «Новое из Сообщества»: двадцать свежих статей блога */
export async function getLatestArticles(locale: Locale) {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/blog", {
            params: { query: { page: 1, limit: 20, sort: "created:desc", lang: locale } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        return data?.data ?? [];
    } catch {
        return [];
    }
}

/** Баннер на главной (задаётся в админке) */
export async function getMainBanner(locale: Locale): Promise<{ url: string; description: string; image?: string } | null> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/marketing-banner/element/{type}", {
            params: { path: { type: "MAIN_PAGE" } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        if (!data?.url || !data.description) return null;
        return { url: data.url, description: data.description, image: (data as { image?: { contentUrl?: string } | null }).image?.contentUrl };
    } catch {
        return null;
    }
}
