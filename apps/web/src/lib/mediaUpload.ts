import type { components } from "@goodsurfing/api";

import { API_URL } from "./browserApi";
import { downscaleImage } from "./imageDownscale";

export type UploadedMedia = components["schemas"]["ImageResultDto"];

/** Больше 5 МБ файлы не загружаются (ImagesUploader старого фронта) */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * Подходит ли файл под accept поля выбора файлов («image/*,application/pdf,.doc»):
 * при перетаскивании браузер accept не проверяет, проверяем сами.
 */
export function matchesAccept(file: { name: string; type: string }, accept: string): boolean {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();
    return accept.split(",").map((rule) => rule.trim().toLowerCase()).filter(Boolean).some((rule) => {
        if (rule.startsWith(".")) return name.endsWith(rule);
        if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
        return type === rule;
    });
}

/**
 * Загрузка файла в хранилище (uploadFile старого фронта): POST
 * /api/v1/media_objects, multipart. Обычный fetch, а не клиент openapi-fetch:
 * тело — FormData с файлом, отмена — через signal. Прогресса у fetch нет —
 * полоса загрузки условная. Ответ — MediaObject; из него нужны id, contentUrl
 * и thumbnails — те же поля, что у ImageResultDto в профиле.
 */
export async function uploadMedia(file: File, token: string | undefined, signal?: AbortSignal): Promise<UploadedMedia> {
    const body = new FormData();
    // Фото уменьшаем в браузере: меньше трафика и нагрузки на сервер (imageDownscale.ts)
    body.append("file", await downscaleImage(file));
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
