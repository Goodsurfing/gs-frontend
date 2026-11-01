import type { components } from "@goodsurfing/api";

import type { CatalogOffer } from "./offersCatalog";
import { mediaUrl } from "./media";

export type OrganizationReview = components["schemas"]["ListByOrganizationIdResult"];

export interface OrganizationOffersPage {
    items: CatalogOffer[];
    total: number;
}

/**
 * Вакансия организации в карточку списка; черновики не показываются (как в
 * старом фронте). category — подпись по названию из API: на сервере через
 * словарь, в браузере — по готовой таблице подписей.
 */
export function toOrganizationOffer(
    offer: components["schemas"]["ListByOrganizationResult"],
    category: (name: string | undefined) => string | undefined,
): CatalogOffer | null {
    if (String(offer.status) === "draft") return null;
    const label = category(offer.categories?.[0]);
    return {
        id: offer.id,
        title: offer.title,
        description: offer.shortDescription,
        image: mediaUrl(offer.image, "medium"),
        address: offer.address,
        category: label,
        rating: Number(offer.averageRating) || 0,
        reviews: offer.reviewsCount,
        went: offer.acceptedApplicationsCount,
        active: String(offer.status) === "active",
        onMap: Number.isFinite(offer.latitude) && Number.isFinite(offer.longitude),
    };
}
