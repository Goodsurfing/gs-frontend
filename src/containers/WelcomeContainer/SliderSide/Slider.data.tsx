import { useTranslation } from "react-i18next";
import slideImage1 from "@/shared/assets/images/welcome-slider/2.webp";
import slideImage2 from "@/shared/assets/images/welcome-slider/3.webp";
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
            title: t("Находи своих в путешествиях"),
            text: t("Участвуй в волонтёрских проектах и экспедициях, знакомься с людьми по духу и открывай новые места вместе с командой"),
            description: t("Сообщество, поддержка и друзья в каждом маршруте"),
            image: slideImage2,
            buttonLink: link,
            buttonLinkText: "Присоединиться к сообществу",
        },
        {
            title: t("Открывай море возможностей"),
            text: t("Выбирай проекты у моря: эко-лагеря, помощь локальным инициативам и путешествия, которые приносят реальную пользу"),
            description: t("Путешествуй с пользой для людей и природы"),
            image: slideImage3,
            buttonLink: link,
            buttonLinkText: "Присоединиться к сообществу",
        },
    ];

    return sliderData;
};
