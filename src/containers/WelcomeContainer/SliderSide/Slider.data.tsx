import { useTranslation } from "react-i18next";
import slideImage from "@/shared/assets/images/welcome-slider/1.png";

export const useTranslatedSliderData = () => {
    const { t } = useTranslation("main");

    const sliderData = [
        {
            title: t("Начните своё путешествие со смыслом"),
            text: t("Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций"),
            image: slideImage,
        },
        {
            title: t("Начните своё путешествие со смыслом 2"),
            text: t("Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций"),
            image: slideImage,
        },
        {
            title: t("Начните своё путешествие со смыслом 3"),
            text: t("Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций"),
            image: slideImage,
        },
    ];

    return sliderData;
};
