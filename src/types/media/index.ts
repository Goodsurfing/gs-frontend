export interface MediaObjectType {
    ["@id"]: string;
    id: string;
    contentUrl: string;
    mimeType: string;
    isImage: boolean;
    originalHeight: number;
    originalWidth: number;
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
