import { Offer, OfferStatus } from "@/entities/Offer";

export const filterOffersByStatus = (
    offers: Offer[] | undefined,
    status: OfferStatus,
): Offer[] => {
    if (!offers) return [];

    if (status === "open" || status === "every_open") {
        return offers.filter(
            (item) => item.status === "open" || item.status === "every_open",
        );
    }

    if (status === "not_filled" || status === "empty") {
        return offers.filter(
            (item) => item.status === "not_filled" || item.status === "empty",
        );
    }

    return [];
};
