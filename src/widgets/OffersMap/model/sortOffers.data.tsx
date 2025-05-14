import { useTranslation } from "react-i18next";
import { SortValue } from "@/entities/Offer";

export interface SortOffers {
    label: string;
    value: SortValue;
}

export const useSortOffers = () => {
    const { t } = useTranslation("offers-map");

    const sortOffers: SortOffers[] = [
        // { label: t("По срочности"), value: "urgency" },
        { label: t("По популярности"), value: "popularity" },
        { label: t("По новизне"), value: "novelty" },
    ];

    return sortOffers;
};
