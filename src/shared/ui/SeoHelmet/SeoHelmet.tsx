import { FC } from "react";
import { Helmet } from "react-helmet-async";
import ogImageDefault from "@/shared/assets/images/og-image.png";

interface SeoHelmetProps {
    title: string;
    description: string;
    canonicalUrl: string;
    keywords?: string;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogUrl?: string;
    alternateUrls?: {
        hrefLang: string;
        href: string;
    }[];
    structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

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
        alternateUrls,
        structuredData,
    } = props;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={canonicalUrl} />
            {alternateUrls?.map(({ hrefLang, href }) => (
                <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
            ))}
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            <meta property="og:url" content={ogUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={ogImage} />
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};
