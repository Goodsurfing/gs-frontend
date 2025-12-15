import { GalleryItem, Image, MediaObjectType } from "@/types/media";
import { BASE_URL } from "../constants/api";
import { ImageType } from "@/entities/Profile";

type MediaContentSize = "SMALL" | "MEDIUM" | "LARGE" | "ORIGINAL";

export const getMediaContent = (
    value: string | MediaObjectType | ImageType | undefined,
    size: MediaContentSize = "ORIGINAL",
): string | undefined => {
    if (!value) return undefined;

    if (typeof value === "string") {
        return `${BASE_URL}${value.slice(1)}`;
    }

    if (typeof value === "object" && "contentUrl" in value) {
        if (size === "ORIGINAL") {
            return `${BASE_URL}${value.contentUrl.slice(1)}`;
        }

        if (value.thumbnails
            && value.thumbnails[size.toLowerCase() as keyof typeof value.thumbnails]) {
            return `${BASE_URL}${value.thumbnails[size.toLowerCase() as keyof typeof value.thumbnails].slice(1)}`;
        }

        // fallback на оригинал, если нужного thumbnail нет
        return `${BASE_URL}${value.contentUrl.slice(1)}`;
    }

    return undefined;
};

export const getMediaContentsArray = (images: (GalleryItem | MediaObjectType
| Image | string)[]) => {
    const newImages = images.map((image) => {
        if (typeof image === "string") {
            return image;
        }
        if ("mediaObject" in image) {
            return `${BASE_URL}${image.mediaObject.contentUrl.slice(1)}`;
        }
        if ("contentUrl" in image && "id" in image && !("@id" in image)) {
            return `${BASE_URL}${image.contentUrl.slice(1)}`;
        }

        return `${BASE_URL}${image.contentUrl.slice(1)}`;
    });
    return newImages;
};

export const getMediaContentsApiArray = (images: Image[]) => {
    const newImages = images.map((image) => image.id);
    return newImages;
};

export const getHostMediaContentsApiArray = (images: MediaObjectType[]) => {
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
