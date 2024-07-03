import { Offer, OfferStatus } from "@/entities/Offer";

export const filterOffersByStatus = (
    offers: Offer[] | undefined,
    status: OfferStatus,
): Offer[] => {
    if (!offers) return [];
    const filteredList = offers.filter(
        (item) => item.status === status || item.status === "empty",
    );

    if (status === "open") {
        return offers.filter((item) => item.status === "open");
    }

    return filteredList.length > 0 ? filteredList : [];
};
