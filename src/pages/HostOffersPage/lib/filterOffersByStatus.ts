import { Offer, OfferStatus } from "@/entities/Offer";

type TextSlice = "title" | "description" | "address";

export const filterOffersByStatus = (
    offers: Offer[] | undefined,
    status: OfferStatus,
): Offer[] | undefined => {
    if (!offers) return;
    const filteredList = offers.filter(
        (item) => item.status === status || item.status === "empty",
    );

    if (status === "open") {
        return offers.filter((item) => item.status === "open");
    }

    return filteredList.length > 0 ? filteredList : undefined;
};

export const textSlice = (
    text: string | undefined,
    length: number,
    textType: TextSlice,
): string => {
    if (!text || text === "") {
        switch (textType) {
            case "title":
                return "Без заголовка";
            case "description":
                return "Без описания";
            case "address":
                return "Без адреса";
            default:
                return "";
        }
    }
    return text.length > length ? `${text.slice(0, length - 1)}..` : text;
};
