export interface MediaObjectType {
    ["@id"]: string;
    id: string;
    contentUrl: string;
}

export interface GalleryItem {
    id: number;
    mediaObject: {
        id: string;
        contentUrl: string;
    };
}
