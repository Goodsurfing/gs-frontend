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

export const getMediaContentsArray = (images: (GalleryItem | MediaObjectType | string)[]) => {
    const newImages = images.map((image) => {
        if (typeof image === "string") {
            return image;
        } if ("mediaObject" in image) {
            return `${BASE_URL}${image.mediaObject.contentUrl.slice(1)}`;
        }
        return `${BASE_URL}${image.contentUrl.slice(1)}`;
    });
    return newImages;
};

export const getMediaContentsApiArray = (images: MediaObjectType[]) => {
    const newImages = images.map((image) => `${BASE_URL}${image["@id"].slice(1)}`);
    return newImages;
};

export const getImageDetails = (image: GalleryItem | string | MediaObjectType) => {
    if (typeof image === "string") {
        return { imgUrl: image, imageId: "" };
    }

    if ("mediaObject" in image) {
        return {
            imgUrl: image.mediaObject.contentUrl,
            imageId: image.id,
        };
    }

    return { imgUrl: image.contentUrl, imageId: image.id };
};
