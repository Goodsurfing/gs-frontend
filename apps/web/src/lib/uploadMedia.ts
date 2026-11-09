import type { components } from "@goodsurfing/api";

import { API_URL } from "./browserApi";
import { downscaleImage } from "./imageDownscale";

/** Загруженный файл (MediaObject): @id — IRI, его ждут ресурсы вроде организации */
export interface UploadedMedia {
    "@id": string;
    id: string;
    contentUrl: string;
    thumbnails?: unknown;
}

/** Тот же ответ в виде схемы ImageResultDto (обложки статей и т. п.) */
export type MediaObject = components["schemas"]["ImageResultDto"] & { id: string };

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

/**
 * Загрузка файла в /api/v1/media_objects (useUploadFile старого фронта):
 * multipart — openapi-fetch его не собирает, поэтому fetch. Ответ в JSON-LD.
 */
export async function uploadMedia(file: File, token?: string): Promise<UploadedMedia & MediaObject> {
    const body = new FormData();
    // Фото уменьшаем в браузере: меньше трафика и нагрузки на сервер (imageDownscale.ts)
    body.append("file", await downscaleImage(file));
    const response = await fetch(`${API_URL}/api/v1/media_objects`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/ld+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body,
    });
    if (!response.ok) throw new Error(`media_objects ${response.status}`);
    return await response.json() as UploadedMedia & MediaObject;
}
