import { type NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { serverApi } from "@/lib/api";
import { categoryName } from "@/lib/categories";
import type { MapOffer } from "@/lib/mapOffers";
import { mediaUrl } from "@/lib/media";
import { offersApiQuery, parseOffersFilters } from "@/lib/offersFilters";

/**
 * Все вакансии для карты по фильтрам каталога (те же параметры, что у
 * страницы /offers-map). Одним запросом — ~1400 точек; кластеры считает карта.
 * Старый фронт подгружал точки кусками по видимой области на каждое движение
 * карты, отсюда мигание и гонки при выборе вакансии.
 *
 * Через новый фронт, а не напрямую в API: тот же адрес у браузера и сервера,
 * без CORS, и ответ ужат до нужных карте полей.
 */
export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const localeParam = params.get("locale") ?? DEFAULT_LOCALE;
    const locale = isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;
    const filters = parseOffersFilters(params);

    try {
        const [t, { data, response }] = await Promise.all([
            getTranslator(locale),
            serverApi(locale).GET("/api/v1/vacancy/for-map/list", {
                params: { query: offersApiQuery(filters) },
                signal: AbortSignal.timeout(10_000),
            }),
        ]);
        if (!data) return NextResponse.json({ error: "upstream" }, { status: response.status >= 500 ? 502 : response.status });

        const offers: MapOffer[] = data
            .filter((offer) => Number.isFinite(offer.latitude) && Number.isFinite(offer.longitude))
            .map((offer) => {
                const category = offer.categories[0];
                return {
                    id: offer.id,
                    name: offer.name ?? "",
                    lat: offer.latitude,
                    lng: offer.longitude,
                    image: mediaUrl(offer.image, "medium"),
                    imageSmall: mediaUrl(offer.image, "small"),
                    category: category ? { name: categoryName(category.name, t) ?? category.name, color: category.color } : undefined,
                };
            });
        return NextResponse.json(offers, { headers: { "Cache-Control": "private, max-age=60" } });
    } catch {
        return NextResponse.json({ error: "upstream" }, { status: 502 });
    }
}
