import type { components } from "@goodsurfing/api";

import { API_URL } from "./browserApi";

export type UploadedMedia = components["schemas"]["ImageResultDto"];

/** Больше 5 МБ файлы не загружаются (ImagesUploader старого фронта) */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * Загрузка файла в хранилище (uploadFile старого фронта): POST
 * /api/v1/media_objects, multipart. Клиент openapi-fetch не умеет FormData с
 * прогрессом и отменой, поэтому — fetch; ответ — тот же MediaObject, что в API.
 */
export async function uploadMedia(file: File, token: string | undefined, signal?: AbortSignal): Promise<UploadedMedia> {
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
    return await response.json() as UploadedMedia;
}
