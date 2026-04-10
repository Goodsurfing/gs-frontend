import { useTranslation } from "react-i18next";
import slideImage1 from "@/shared/assets/images/welcome-slider/2.webp";
import slideImage3 from "@/shared/assets/images/welcome-slider/5.webp";
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
            image: slideImage1,
            buttonLink: link,
            buttonLinkText: "Присоединиться к сообществу",
        },
        {
            title: t("Примите тех, кто хочет помогать и делайте мир лучше вместе"),
            text: t("Мы соединяем вас с людьми, готовыми приехать к вам и помочь на месте. Найдите помощников для задач на сезон, экспедицию или долгий проект."),
            description: t("С нами уже больше 1500 проектов"),
            image: slideImage3,
            buttonLink: link,
            buttonLinkText: "Стать хостом",
        },
    ];

    return sliderData;
};
