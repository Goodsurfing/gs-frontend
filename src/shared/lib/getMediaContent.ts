import { GalleryItem, MediaObjectType } from "@/types/media";
import { BASE_URL } from "../constants/api";
import { ImageType } from "@/entities/Profile";

export const getMediaContent = (
    value: string | MediaObjectType | ImageType | undefined,
): string | undefined => {
    switch (typeof value) {
        case "string":
            return `${BASE_URL}${value.slice(1)}`;
        case "object":
            if (value && "contentUrl" in value) {
                return `${BASE_URL}${value.contentUrl.slice(1)}`;
            }
            return undefined;
        default:
            return undefined;
    }
};

export const getMediaContentsArray = (images: GalleryItem[]) => {
    const newImages = images.map((image) => `${BASE_URL}${image.mediaObject.contentUrl.slice(1)}`);
    return newImages;
};
