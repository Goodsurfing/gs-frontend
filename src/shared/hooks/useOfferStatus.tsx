import { useTranslation } from "react-i18next";
import { OfferStatus } from "@/entities/Offer";

export const useOfferStatus = () => {
    const { t } = useTranslation("offer");

    const offerStatusList: Record<OfferStatus, string> = {
        active: t("personalOffer.active"),
        disabled: t("personalOffer.disabled"),
        draft: t("personalOffer.draft"),
    };

    const getOfferStatus = (offerStatus: OfferStatus) => offerStatusList[offerStatus];

    return { getOfferStatus };
};
