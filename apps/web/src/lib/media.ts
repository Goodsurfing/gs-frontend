import type { components } from "@goodsurfing/api";

import { API_URL } from "./browserApi";

type Image = components["schemas"]["ImageResultDto"];

const absolute = (url: string) => (/^https?:\/\//.test(url) ? url : `${API_URL}${url.startsWith("/") ? url : `/${url}`}`);

/** Адрес картинки нужного размера (как getMediaContent старого фронта); нет превью — оригинал. */
export function mediaUrl(image: Image | null | undefined, size: "small" | "medium" | "large" | "original" = "original") {
    if (!image?.contentUrl) return undefined;
    const thumbnails = image.thumbnails as Record<string, string | undefined> | undefined;
    const thumb = size === "original" ? undefined : thumbnails?.[size];
    return absolute(thumb || image.contentUrl);
}
