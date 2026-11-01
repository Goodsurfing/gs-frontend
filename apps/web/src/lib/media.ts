import { API_URL } from "./browserApi";

/** Картинка с API: и ImageResultDto, и MediaObject (у разных ресурсов разные схемы) */
type Image = { contentUrl?: string | null; thumbnails?: unknown };

const absolute = (url: string) => (/^https?:\/\//.test(url) ? url : `${API_URL}${url.startsWith("/") ? url : `/${url}`}`);

/** Адрес картинки нужного размера (как getMediaContent старого фронта); нет превью — оригинал. */
export function mediaUrl(image: Image | null | undefined, size: "small" | "medium" | "large" | "original" = "original") {
    if (!image?.contentUrl) return undefined;
    const thumbnails = image.thumbnails as Record<string, string | undefined> | undefined;
    const thumb = size === "original" ? undefined : thumbnails?.[size];
    return absolute(thumb || image.contentUrl);
}
