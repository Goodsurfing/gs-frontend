export interface MediaObjectType {
    ["@id"]: string;
    id: string;
    contentUrl: string;
    mimeType: string;
    isImage: boolean;
    originalHeight: number;
    originalWidth: number;
    /** Имя, с которым файл загрузили; null у файлов, загруженных до 2026-10-27 */
    originalName?: string | null;
    thumbnails?: {
        large: string;
        medium: string;
        small: string;
    }
}

export interface GalleryItem {
    id: number;
    mediaObject: MediaObjectType;
}

export interface Image {
    id: string;
    contentUrl: string;
    thumbnails?: {
        large: string;
        medium: string;
        small: string;
    }
}

/** Прикреплённый файл (материалы к уроку). name — имя, с которым файл загрузили;
 * null у файлов, загруженных до 2026-10-27. */
export interface AttachedFile {
    id: string;
    contentUrl: string;
    name?: string | null;
}
