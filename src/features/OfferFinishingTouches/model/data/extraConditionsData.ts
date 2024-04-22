import { useTranslation } from "react-i18next";
import { ExtraConditions } from "@/entities/Offer";
import {
    adultsIcon,
    animalsIcon,
    kidsIcon,
    pairsIcon,
    studentsIcon,
    vegansIcon,
} from "@/shared/data/icons/finishingTouches";

export type ExtraConditionsData = {
    id: ExtraConditions;
    text: string;
    icon: string;
};

export const useExtraConditionsData = () => {
    const { t } = useTranslation("offer");
    const extraConditionsData: ExtraConditionsData[] = [{
        id: "allow-kids",
        icon: kidsIcon,
        text: t("finishingTouches.Можно с детьми"),
    }, {
        id: "allow-pets",
        icon: animalsIcon,
        text: t("finishingTouches.Можно с животными"),
    }, {
        id: "couples",
        icon: pairsIcon,
        text: t("finishingTouches.Принимаем парами"),
    }, {
        id: "students",
        icon: studentsIcon,
        text: t("finishingTouches.Можно студентам"),
    }, {
        id: "vegetarian",
        icon: vegansIcon,
        text: t("finishingTouches.Только для вегетарианцев"),
    }, {
        id: "adult-only",
        icon: adultsIcon,
        text: t("finishingTouches.Только для совершеннолетних"),
    }];

    return { extraConditionsData };
};
