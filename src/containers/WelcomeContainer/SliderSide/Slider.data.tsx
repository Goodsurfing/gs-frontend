import { useTranslation } from "react-i18next";
import slideImage from "@/shared/assets/images/welcome-slider/2.png";
import { getOffersMapPageUrl, getSignInPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useAuth } from "@/routes/model/guards/AuthProvider";

export const useTranslatedSliderData = () => {
    const { t } = useTranslation("main");
    const { locale } = useLocale();
    const { isAuth } = useAuth();
    const link = isAuth ? getOffersMapPageUrl(locale) : getSignInPageUrl(locale);

    const sliderData = [
        {
            title: t("Путешествуй, помогай, меняй мир"),
            text: t("Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций"),
            description: t("С нами уже 90 000 путешественников со смыслом со всего мира"),
            image: slideImage,
            buttonLink: link,
            buttonLinkText: "Присоединиться к сообществу",
        },
        {
            title: t("Начните своё путешествие со смыслом 2"),
            text: t("Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций"),
            description: t("С нами уже 90 000 путешественников со смыслом со всего мира"),
            image: slideImage,
            buttonLink: link,
            buttonLinkText: "Присоединиться к сообществу",
        },
        {
            title: t("Начните своё путешествие со смыслом 3"),
            text: t("Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций"),
            description: t("С нами уже 90 000 путешественников со смыслом со всего мира"),
            image: slideImage,
            buttonLink: link,
            buttonLinkText: "Присоединиться к сообществу",
        },
    ];

    return sliderData;
};
