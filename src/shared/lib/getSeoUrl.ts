import { MAIN_URL } from "@/shared/constants/api";

const SEO_DESCRIPTION_LIMIT = 160;

const trimTrailingSlash = (value: string) => value.replace(/\/$/, "");

const normalizePath = (path: string) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return normalizedPath === "/" ? normalizedPath : trimTrailingSlash(normalizedPath);
};

export const getTextFromHtml = (value: string) => value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const getSeoDescription = (value: string, limit = SEO_DESCRIPTION_LIMIT) => {
    const text = getTextFromHtml(value);

    if (text.length <= limit) {
        return text;
    }

    return `${text.slice(0, limit - 3)}...`;
};

export const getSeoUrl = (path: string) => `${trimTrailingSlash(MAIN_URL)}${normalizePath(path)}`;
