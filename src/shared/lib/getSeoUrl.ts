import { MAIN_URL } from "@/shared/constants/api";

const trimTrailingSlash = (value: string) => value.replace(/\/$/, "");

const normalizePath = (path: string) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return normalizedPath === "/" ? normalizedPath : trimTrailingSlash(normalizedPath);
};

export const getSeoUrl = (path: string) => `${trimTrailingSlash(MAIN_URL)}${normalizePath(path)}`;
