import { useTranslation } from "react-i18next";
import slideImage from "@/shared/assets/images/welcome-slider/1.png";

export const useTranslatedSliderData = () => {
    const { t } = useTranslation("main");

    const sliderData = [
        {
            title: "Начните своё путешествие со смыслом",
            text: "Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций",
            image: slideImage,
        },
        {
            title: "Начните своё путешествие со смыслом 2",
            text: "Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций",
            image: slideImage,
        },
        {
            title: "Начните своё путешествие со смыслом 3",
            text: "Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций",
            image: slideImage,
        },
    ];

    const translatedData = sliderData.map((item) => ({
        ...item,
        title: t(item.title),
        text: t(item.text),
    }));

    return translatedData;
};
