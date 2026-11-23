import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getOrganization } from "@/lib/organization";
import { organizationBadgeImage } from "@/lib/shareCard";

type Context = { params: Promise<{ locale: string; id: string }> };

/**
 * Значок «Мы на Гудсёрфинге» для сайта организатора: /organizations/:id/badge —
 * PNG 600×200 с рейтингом и числом отзывов (обновляется сам). Код для сайта —
 * в кабинете организатора, «Значок для сайта».
 */
export async function GET(_request: Request, { params }: Context) {
    const { locale, id } = await params;
    if (!isLocale(locale)) return new Response(null, { status: 404 });
    const [result, tHost] = await Promise.all([getOrganization(locale, id), getTranslator(locale, "host")]);
    if (result.kind !== "ok") return new Response(null, { status: result.kind === "error" ? 503 : 404 });
    const { organization } = result;
    const reviews = organization.reviewsCount ?? 0;
    return organizationBadgeImage({
        name: organization.name ?? "",
        rating: organization.averageRating ?? null,
        reviews,
        title: tHost("badge.image-title"),
        ratingText: tHost("badge.image-rating"),
        reviewsText: tHost("badge.image-reviews", { count: reviews }),
    });
}
