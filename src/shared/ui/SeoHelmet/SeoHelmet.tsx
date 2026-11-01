import { FC } from "react";
import { Helmet } from "react-helmet-async";
import ogImageDefault from "@/shared/assets/images/og-image.jpg";
import { localeFromPath, withLocalePath } from "@/shared/config/routes/localePath";

const SITE_NAME = "GoodSurfing";
const LOCALES = ["ru", "en", "es"] as const;
const DEFAULT_LOCALE = "ru";
const OG_LOCALE: Record<string, string> = { ru: "ru_RU", en: "en_US", es: "es_ES" };
// Адрес страницы: домен + путь (у русского без префикса, у en/es — /en, /es)
const ABSOLUTE_URL = /^(https?:\/\/[^/?#]+)([^?#]*)(.*)$/;

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
 * Языковые версии страницы по канонической ссылке: русская без префикса,
 * /en и /es, x-default — на русскую (GS-213). Пусто, если ссылка не абсолютная.
 */
export const getAlternateUrls = (canonicalUrl: string) => {
    const match = canonicalUrl.match(ABSOLUTE_URL);
    if (!match) return [];
    const [, origin, path] = match;
    // Без завершающего «/» (кроме корня) — как getSeoUrl у канонической ссылки
    const withLocale = (locale: string) => `${origin}${withLocalePath(path || "/", locale).replace(/(.)\/$/, "$1")}`;
    return [
        ...LOCALES.map((locale) => ({ hrefLang: locale, href: withLocale(locale) })),
        { hrefLang: "x-default", href: withLocale(DEFAULT_LOCALE) },
    ];
};

const getLocale = (canonicalUrl: string) => localeFromPath(canonicalUrl.match(ABSOLUTE_URL)?.[2] ?? "/");

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
