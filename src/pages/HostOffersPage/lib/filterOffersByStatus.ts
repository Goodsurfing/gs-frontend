import { MyOffers, OfferStatus } from "@/entities/Offer";

type TextSlice = "title" | "description";

export const filterOffersByStatus = (
    offers: MyOffers | undefined,
    status: OfferStatus,
): MyOffers | undefined => {
    if (!offers) return;
    const filteredList = offers.list.filter(
        (item) => item.status === status || item.status === "empty",
    );

    if (status === "open") {
        return { list: offers.list.filter((item) => item.status === "open") } as MyOffers;
    }

    return filteredList.length > 0 ? { list: filteredList } as MyOffers : undefined;
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
            default:
                return "";
        }
    }
    return text.length > length ? `${text.slice(0, length - 1)}..` : text;
};
