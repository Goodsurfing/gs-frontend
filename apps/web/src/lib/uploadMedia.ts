import { API_URL } from "./browserApi";

/** Загруженный файл (MediaObject): @id — IRI, его ждут ресурсы вроде организации */
export interface UploadedMedia {
    "@id": string;
    id: string;
    contentUrl: string;
    thumbnails?: unknown;
}

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

/**
 * Загрузка файла в /api/v1/media_objects (multipart — openapi-fetch его не
 * собирает, поэтому fetch). Ответ в JSON-LD: в нём есть @id.
 */
export async function uploadMedia(file: File, token?: string): Promise<UploadedMedia> {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch(`${API_URL}/api/v1/media_objects`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/ld+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body,
    });
    if (!response.ok) throw new Error(`media_objects ${response.status}`);
    return await response.json() as UploadedMedia;
}
