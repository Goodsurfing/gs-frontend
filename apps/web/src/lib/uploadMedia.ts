import type { components } from "@goodsurfing/api";

import { API_URL } from "./browserApi";

export type MediaObject = components["schemas"]["ImageResultDto"] & { id: string };

/**
 * Загрузка файла в хранилище (useUploadFile старого фронта): POST
 * /api/v1/media_objects multipart — в OpenAPI тела нет, поэтому fetch.
 */
export async function uploadMedia(file: File, token?: string): Promise<MediaObject> {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch(`${API_URL}/api/v1/media_objects`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/ld+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body,
    });
    if (!response.ok) throw new Error(String(response.status));
    return await response.json() as MediaObject;
}
