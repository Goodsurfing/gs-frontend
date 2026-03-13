import { useTranslation } from "react-i18next";
import { DonationSort, DonationRatingSort } from "../model/types/donationSchema";

export interface SortDonations {
    label: string;
    value: DonationSort;
}

export interface SortRatingDonations {
    label: string;
    value: DonationRatingSort;
}

export const useSortDonations = () => {
    const { t } = useTranslation("donation");

    const sortDonations: SortDonations[] = [
        { label: t("По срочности"), value: "urgency" },
        { label: t("По популярности"), value: "popular" },
    ];

    return sortDonations;
};

export const useSortRatingDonations = () => {
    const { t } = useTranslation("donation");

    const sortDonations: SortRatingDonations[] = [
        { label: t("По кол-ву пожертвований"), value: "numberDonations" },
        { label: t("По общей сумме пожертвований"), value: "totalAmountDonations" },
    ];

    return sortDonations;
};
