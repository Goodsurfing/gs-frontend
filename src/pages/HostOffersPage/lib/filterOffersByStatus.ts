import { Offer, OfferStatus } from "@/entities/Offer";

export const filterOffersByStatus = (
    offers: Offer[] | undefined,
    status: OfferStatus,
): Offer[] => {
    if (!offers) return [];

    if (status === "active" || status === "disabled") {
        return offers.filter(
            (item) => item.status === "active" || item.status === "disabled",
        );
    }

    if (status === "draft") {
        return offers.filter(
            (item) => item.status === "draft",
        );
    }

    return [];
};
