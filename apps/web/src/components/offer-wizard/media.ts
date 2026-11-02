import { API_URL } from "@/lib/browserApi";

/** Загруженная картинка: id для API, адрес и превью для показа */
export interface UploadedImage {
    id: string;
    contentUrl: string;
    thumbnails?: Record<string, string>;
}

/** Картинка из ответа API с проверкой полей (у разных ресурсов разные схемы MediaObject) */
export function toUploadedImage(value: unknown): UploadedImage | null {
    const v = value as { id?: unknown; contentUrl?: unknown; thumbnails?: unknown } | null;
    if (!v || typeof v.id !== "string" || !v.id || typeof v.contentUrl !== "string" || !v.contentUrl) return null;
    const thumbnails = v.thumbnails && typeof v.thumbnails === "object" && !Array.isArray(v.thumbnails) ? v.thumbnails as Record<string, string> : undefined;
    return { id: v.id, contentUrl: v.contentUrl, thumbnails };
}

/**
 * Загрузка файла в POST /api/v1/media_objects (multipart, как в «Обо мне»):
 * openapi-fetch не умеет FormData с типами, поэтому — fetch с теми же заголовками.
 */
export async function uploadImage(file: File, token: string | undefined, signal?: AbortSignal): Promise<UploadedImage> {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch(`${API_URL}/api/v1/media_objects`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/ld+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body,
        signal,
    });
    if (!response.ok) throw new Error(String(response.status));
    const image = toUploadedImage(await response.json());
    if (!image) throw new Error("media");
    return image;
}

/** Ширина и высота картинки до загрузки (checkWidthAndHeight старого фронта) */
export function imageSize(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            resolve({ width: image.naturalWidth, height: image.naturalHeight });
            URL.revokeObjectURL(url);
        };
        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("image"));
        };
        image.src = url;
    });
}
