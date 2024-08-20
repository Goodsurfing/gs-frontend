import { useTranslation } from "react-i18next";
import { Gender } from "@/entities/Offer";

export const useFormatGenders = (genders: Gender[]) => {
    const { t } = useTranslation("offer");

    return genders.length > 0
        ? genders.map((gender) => t(`personalOffer.${gender}`)).join(", ")
        : t("personalOffer.notSpecified");
};
