import { FC } from "react";
import { useTranslation } from "react-i18next";

import { getSeoDescription, getSeoUrl } from "@/shared/lib/getSeoUrl";

import { SeoHelmet } from "./SeoHelmet";

export type SeoSection =
    | "offersMap" | "categories" | "findJob" | "becomeHost" | "rules"
    | "privacyPolicy" | "paymentSecurityPolicy" | "donationsMap" | "donationReports"
    | "host" | "volunteer";

interface PageSeoProps {
    /** Ключ страницы в seo.json — тексты по умолчанию */
    section: SeoSection;
    /** Путь страницы с языком, например /ru/offers-map */
    path: string;
    /** Заголовок из данных страницы (организация, профиль) */
    title?: string;
    /** Описание из данных страницы; HTML и длина приводятся к виду для поиска */
    description?: string;
    image?: string;
    noindex?: boolean;
    ogType?: "website" | "article" | "profile";
}

/**
 * Мета-теги публичной страницы с текстами из seo.json (GS-213). Данные
 * страницы, если переданы, важнее текстов по умолчанию.
 */
export const PageSeo: FC<PageSeoProps> = (props) => {
    const {
        section, path, title, description, image, noindex, ogType,
    } = props;
    const { t } = useTranslation("seo");
    const defaultTitle = t(`${section}.title`);

    return (
        <SeoHelmet
            title={title ? `${title} — GoodSurfing` : defaultTitle}
            description={description ? getSeoDescription(description) : t(`${section}.description`)}
            canonicalUrl={getSeoUrl(path)}
            ogImage={image}
            noindex={noindex}
            ogType={ogType}
        />
    );
};
