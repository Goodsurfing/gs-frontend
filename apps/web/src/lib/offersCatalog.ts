import "server-only";

import type { Locale } from "@/i18n/config";
import type { Translate } from "@/i18n/dictionary";

import { serverApi } from "./api";
import { categoryName } from "./categories";
import { mediaUrl } from "./media";
import { OFFERS_PER_PAGE, offersApiQuery, type OffersFilters } from "./offersFilters";

/** Вакансия в списке каталога — ровно то, что рисует карточка. */
export interface CatalogOffer {
    id: number;
    title: string;
    description: string;
    image?: string;
    address: string;
    category?: string;
    rating: number;
    reviews: number;
    went: number;
    /** Вакансия открыта (закрытые показываются бледнее) */
    active: boolean;
    /** Есть координаты — вакансия есть на карте */
    onMap: boolean;
}

export interface CatalogPage {
    offers: CatalogOffer[];
    total: number;
}

const SORT = { novelty: "updated:desc", popularity: "popularity:desc" } as const;

/** Страница списка каталога по фильтрам; null — API недоступен. */
export async function getCatalogPage(locale: Locale, filters: OffersFilters, t: Translate): Promise<CatalogPage | null> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/vacancy", {
            params: {
                query: {
                    ...offersApiQuery(filters),
                    sort: SORT[filters.sort],
                    page: filters.page,
                    limit: OFFERS_PER_PAGE,
                    fields: "card",
                },
            },
            signal: AbortSignal.timeout(8000),
        });
        if (!data) return null;
        return {
            total: data.pagination?.total ?? 0,
            offers: (data.data ?? []).map((offer) => ({
                id: offer.id,
                title: offer.title,
                description: offer.shortDescription,
                // У старых (легаси) вакансий нет превью — тогда оригинал
                image: mediaUrl(offer.image, "medium"),
                address: offer.address,
                category: categoryName(offer.categories[0]?.name, t),
                rating: Number(offer.averageRating) || 0,
                reviews: offer.reviewsCount,
                went: offer.acceptedApplicationsCount,
                active: String(offer.status) === "active",
                onMap: Number.isFinite(offer.latitude) && Number.isFinite(offer.longitude),
            })),
        };
    } catch {
        return null;
    }
}
