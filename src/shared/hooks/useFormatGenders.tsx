import { useTranslation } from "react-i18next";
import { Gender } from "@/entities/Offer";

export const useFormatGenders = (genders: Gender[]) => {
    const { t } = useTranslation("offer");

    const genderList: Record<Gender, string> = {
        male: t("personalOffer.male"),
        female: t("personalOffer.female"),
        other: t("personalOffer.other"),
    };

    return genders.length > 0
        ? genders.map((gender) => genderList[gender]).join(", ")
        : t("personalOffer.notSpecified");
};
