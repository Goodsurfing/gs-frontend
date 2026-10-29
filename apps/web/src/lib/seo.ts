import type { Metadata } from "next";

import { DEFAULT_LOCALE, LOCALES, type Locale, withLocale } from "@/i18n/config";

const SITE_NAME = "GoodSurfing";
const OG_LOCALE: Record<Locale, string> = { ru: "ru_RU", en: "en_US", es: "es_ES" };

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || "https://goodsurfing.org").replace(/\/$/, "");

interface PageMetadataInput {
    locale: Locale;
    /** Путь страницы с языком: /ru/payment-security-policy */
    path: string;
    title: string;
    description: string;
    image?: string;
    type?: "website" | "article" | "profile";
    noindex?: boolean;
}

/**
 * Мета-теги публичной страницы — те же, что ставил SeoHelmet старого фронта
 * (GS-213): title, description, canonical, hreflang ru/en/es + x-default,
 * Open Graph и Twitter. og:image по умолчанию — /og-image.jpg.
 */
export function pageMetadata({ locale, path, title, description, image, type = "website", noindex }: PageMetadataInput): Metadata {
    const url = `${siteUrl()}${path}`;
    const languages = Object.fromEntries([
        ...LOCALES.map((code) => [code, `${siteUrl()}${withLocale(path, code)}`]),
        ["x-default", `${siteUrl()}${withLocale(path, DEFAULT_LOCALE)}`],
    ]);
    const ogImage = image ?? `${siteUrl()}/og-image.jpg`;

    return {
        title,
        description,
        alternates: { canonical: url, languages },
        robots: noindex ? { index: false, follow: true } : undefined,
        openGraph: {
            siteName: SITE_NAME,
            locale: OG_LOCALE[locale],
            title,
            description,
            url,
            type,
            images: [ogImage],
        },
        twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    };
}
