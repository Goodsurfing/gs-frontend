import type { components } from "@goodsurfing/api";

import type { CatalogOffer } from "./offersCatalog";
import { mediaUrl } from "./media";

export type VolunteerReview = components["schemas"]["ListByVolunteerIdResult"];

/** Вакансия (детальная из API) в карточку списка на странице волонтёра */
export function toParticipatedOffer(
    offer: components["schemas"]["ElementResult8"],
    category: (name: string | undefined) => string | undefined,
): CatalogOffer {
    const { description, where } = offer;
    return {
        id: offer.id,
        title: description?.title ?? "",
        description: description?.shortDescription ?? "",
        image: mediaUrl(description?.image, "medium"),
        address: where?.address ?? "",
        category: category(description?.categories?.[0]?.name),
        rating: Number(offer.averageRating) || 0,
        reviews: offer.reviewsCount,
        went: offer.acceptedApplicationsCount,
        active: offer.status === "active",
        onMap: !!where && Number.isFinite(Number(where.latitude)),
    };
}
