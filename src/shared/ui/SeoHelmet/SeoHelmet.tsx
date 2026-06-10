import { FC } from "react";
import { Helmet } from "react-helmet-async";
import ogImageDefault from "@/shared/assets/images/og-image.png";

interface SeoHelmetProps {
    title: string;
    description: string;
    canonicalUrl: string;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogUrl?: string;
}

export const SeoHelmet: FC<SeoHelmetProps> = (props) => {
    const {
        title,
        description,
        canonicalUrl,
        ogImage = ogImageDefault,
        ogTitle = title,
        ogDescription = description,
        ogUrl = canonicalUrl,
    } = props;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            <meta property="og:url" content={ogUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={ogImage} />
        </Helmet>
    );
};
