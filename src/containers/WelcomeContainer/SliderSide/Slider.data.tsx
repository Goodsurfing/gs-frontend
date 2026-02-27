import { useTranslation } from "react-i18next";
import slideImage from "@/shared/assets/images/welcome-slider/2.png";
import { getSignInPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

export const useTranslatedSliderData = () => {
    const { t } = useTranslation("main");
    const { locale } = useLocale();

    const sliderData = [
        {
            title: t("Путешествуй, помогай, меняй мир"),
            text: t("Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций"),
            description: t("С нами уже 90 000 путешественников со смыслом со всего мира"),
            image: slideImage,
            buttonLink: getSignInPageUrl(locale),
            buttonLinkText: "Присоединиться к сообществу",
        },
        {
            title: t("Начните своё путешествие со смыслом 2"),
            text: t("Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций"),
            description: t("С нами уже 90 000 путешественников со смыслом со всего мира"),
            image: slideImage,
            buttonLink: getSignInPageUrl(locale),
            buttonLinkText: "Присоединиться к сообществу",
        },
        {
            title: t("Начните своё путешествие со смыслом 3"),
            text: t("Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций"),
            description: t("С нами уже 90 000 путешественников со смыслом со всего мира"),
            image: slideImage,
            buttonLink: getSignInPageUrl(locale),
            buttonLinkText: "Присоединиться к сообществу",
        },
    ];

    return sliderData;
};
