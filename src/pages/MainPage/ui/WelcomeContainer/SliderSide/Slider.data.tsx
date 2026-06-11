import { useTranslation } from "react-i18next";
import slideImage1 from "@/shared/assets/images/welcome-slider/2.webp";
import slideImage3 from "@/shared/assets/images/welcome-slider/5.webp";
import { getBecomeHostPageUrl, getOffersMapPageUrl, getSignInPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useGetAbouProjectPageInfoQuery } from "@/entities/Admin";

const LOCALE_NUMBER_FORMAT: Record<string, string> = {
    ru: "ru-RU",
    en: "en-US",
    es: "es-ES",
};

export const useTranslatedSliderData = () => {
    const { t } = useTranslation("main");
    const { locale } = useLocale();
    const { isAuth } = useAuth();
    const link = isAuth ? getOffersMapPageUrl(locale) : getSignInPageUrl(locale);
    const { data: statsData } = useGetAbouProjectPageInfoQuery();

    const formatCount = (n: number) => {
        const rounded = Math.floor(n / 1000) * 1000;
        return new Intl.NumberFormat(LOCALE_NUMBER_FORMAT[locale] ?? "ru-RU").format(rounded);
    };

    const volunteerDesc = statsData?.today.volunteerCount
        ? t("slider.volunteerCount", { count: formatCount(statsData.today.volunteerCount) })
        : t("С нами уже 90 000 путешественников со смыслом со всего мира");

    const vacancyDesc = statsData?.today.vacancyCount
        ? t("slider.vacancyCount", { count: formatCount(statsData.today.vacancyCount) })
        : t("С нами уже больше 1500 проектов");

    const sliderData = [
        {
            title: t("Путешествуй, помогай, меняй мир"),
            text: t("Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций"),
            description: volunteerDesc,
            image: slideImage1,
            buttonLink: link,
            buttonLinkText: "Присоединиться к сообществу",
        },
        {
            title: t("Примите тех, кто хочет помогать и делайте мир лучше вместе"),
            text: t("Мы соединяем вас с людьми, готовыми приехать к вам и помочь на месте. Найдите помощников для задач на сезон, экспедицию или долгий проект."),
            description: vacancyDesc,
            image: slideImage3,
            buttonLink: getBecomeHostPageUrl(locale),
            buttonLinkText: "Стать хостом",
        },
    ];

    return sliderData;
};
