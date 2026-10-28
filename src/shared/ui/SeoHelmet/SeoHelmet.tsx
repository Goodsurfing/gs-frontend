import { FC } from "react";
import { Helmet } from "react-helmet-async";
import ogImageDefault from "@/shared/assets/images/og-image.jpg";

const SITE_NAME = "GoodSurfing";
const LOCALES = ["ru", "en", "es"] as const;
const DEFAULT_LOCALE = "ru";
const OG_LOCALE: Record<string, string> = { ru: "ru_RU", en: "en_US", es: "es_ES" };
// /ru, /en или /es сразу после домена
const LOCALE_SEGMENT = /^(https?:\/\/[^/]+)\/(ru|en|es)(?=\/|$)/;

interface SeoHelmetProps {
    title: string;
    description: string;
    canonicalUrl: string;
    keywords?: string;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogUrl?: string;
    ogType?: "website" | "article" | "profile";
    alternateUrls?: {
        hrefLang: string;
        href: string;
    }[];
    structuredData?: Record<string, unknown> | Record<string, unknown>[];
    /** Не индексировать (профили людей и т. п.) */
    noindex?: boolean;
}

/**
 * Языковые версии страницы по канонической ссылке: тот же путь с /ru, /en,
 * /es и x-default на русскую (GS-213). Пусто, если в ссылке нет языка.
 */
export const getAlternateUrls = (canonicalUrl: string) => {
    if (!LOCALE_SEGMENT.test(canonicalUrl)) return [];
    const withLocale = (locale: string) => canonicalUrl
        .replace(LOCALE_SEGMENT, `$1/${locale}`);
    return [
        ...LOCALES.map((locale) => ({ hrefLang: locale, href: withLocale(locale) })),
        { hrefLang: "x-default", href: withLocale(DEFAULT_LOCALE) },
    ];
};

const getLocale = (canonicalUrl: string) => (
    canonicalUrl.match(LOCALE_SEGMENT)?.[2] ?? DEFAULT_LOCALE
);

export const SeoHelmet: FC<SeoHelmetProps> = (props) => {
    const {
        title,
        description,
        canonicalUrl,
        keywords,
        ogImage = ogImageDefault,
        ogTitle = title,
        ogDescription = description,
        ogUrl = canonicalUrl,
        ogType = "website",
        alternateUrls = getAlternateUrls(canonicalUrl),
        structuredData,
        noindex = false,
    } = props;
    const locale = getLocale(canonicalUrl);

    return (
        <Helmet>
            <html lang={locale} />
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {noindex && <meta name="robots" content="noindex, follow" />}
            <link rel="canonical" href={canonicalUrl} />
            {alternateUrls.map(({ hrefLang, href }) => (
                <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
            ))}
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content={OG_LOCALE[locale] ?? OG_LOCALE[DEFAULT_LOCALE]} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            <meta property="og:url" content={ogUrl} />
            <meta property="og:type" content={ogType} />
            <meta property="og:image" content={ogImage} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle} />
            <meta name="twitter:description" content={ogDescription} />
            <meta name="twitter:image" content={ogImage} />
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};
