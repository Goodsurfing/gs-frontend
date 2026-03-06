import { useTranslation } from "react-i18next";
import { DonationSort } from "../model/types/donationSchema";

export interface SortDonations {
    label: string;
    value: DonationSort;
}

export const useSortDonations = () => {
    const { t } = useTranslation("donation");

    const sortOffers: SortDonations[] = [
        { label: t("По срочности"), value: "urgency" },
        { label: t("По популярности"), value: "popular" },
    ];

    return sortOffers;
};
