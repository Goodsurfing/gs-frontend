import { FC } from "react";
import { Helmet } from "react-helmet-async";

interface SeoHelmetProps {
    title: string;
    description: string;
    canonicalUrl: string;
    ogTitle?: string;
    ogDescription?: string;
    ogUrl?: string;
    robots?: string;
}

export const SeoHelmet: FC<SeoHelmetProps> = (props) => {
    const {
        title,
        description,
        canonicalUrl,
        ogTitle = title,
        ogDescription = description,
        ogUrl = canonicalUrl,
        robots = "index, follow",
    } = props;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content={robots} />
            <link rel="canonical" href={canonicalUrl} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            <meta property="og:url" content={ogUrl} />
            <meta property="og:type" content="website" />
        </Helmet>
    );
};
