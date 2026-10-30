import { type NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { serverApi } from "@/lib/api";
import { categoryName } from "@/lib/categories";
import { donationsMapApiQuery, parseDonationsFilters } from "@/lib/donationsFilters";
import type { MapOffer } from "@/lib/mapOffers";
import { mediaUrl } from "@/lib/media";

/**
 * Все сборы для карты по фильтрам каталога (/donation-map), в том же виде,
 * что точки вакансий, — карта у каталогов общая. Бэкенд отдаёт объект
 * «id → сбор», а не массив.
 */
export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const localeParam = params.get("locale") ?? DEFAULT_LOCALE;
    const locale = isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;
    const filters = parseDonationsFilters(params);

    try {
        const [t, { data, response }] = await Promise.all([
            getTranslator(locale),
            serverApi(locale).GET("/api/v1/fundraise/for-map/list", {
                params: { query: donationsMapApiQuery(filters) },
                signal: AbortSignal.timeout(10_000),
            }),
        ]);
        if (!data) return NextResponse.json({ error: "upstream" }, { status: response.status >= 500 ? 502 : response.status });

        type Point = { id: string; name?: string | null; latitude?: number | null; longitude?: number | null; image?: { contentUrl?: string | null; thumbnails?: unknown } | null; categories?: { name: string; color: string }[] };
        const list = (Array.isArray(data) ? data : Object.values(data as Record<string, unknown>)) as Point[];
        const points: MapOffer[] = list
            .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
            .map((item) => {
                const category = item.categories?.[0];
                return {
                    id: item.id,
                    name: item.name ?? "",
                    lat: item.latitude as number,
                    lng: item.longitude as number,
                    image: mediaUrl(item.image, "medium"),
                    imageSmall: mediaUrl(item.image, "small"),
                    category: category ? { name: categoryName(category.name, t) ?? category.name, color: category.color } : undefined,
                };
            });
        return NextResponse.json(points, { headers: { "Cache-Control": "private, max-age=60" } });
    } catch {
        return NextResponse.json({ error: "unavailable" }, { status: 502 });
    }
}
