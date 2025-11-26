import { HostOffer, OfferStatus } from "@/entities/Offer";

export const filterOffersByStatus = (
    offers: HostOffer[] | undefined,
    status: OfferStatus,
): HostOffer[] => {
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
