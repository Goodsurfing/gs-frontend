import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { ImagesUploader } from "@/shared/ui/ImagesUploader/ImagesUploader";
import { Image, MediaObjectType } from "@/types/media";
import { getMediaContentsApiArray } from "@/shared/lib/getMediaContent";

interface OfferGalleryProps {
    className?: string;
    imageGallery?: Image[];
    onUploadImageGallery: (data: string[]) => void;
}

export const OfferGallery: FC<OfferGalleryProps> = (props) => {
    const {
        className, imageGallery = [],
        onUploadImageGallery,
    } = props;

    const [imgs, setImgs] = useState<Image[]>([]);

    useEffect(() => {
        if (imageGallery) {
            setImgs(imageGallery);
        } else {
            setImgs([]);
        }
    }, [imageGallery]);

    const handleOnUpload = useCallback(
        async (images: MediaObjectType[]) => {
            const currentGalleryImages = getMediaContentsApiArray(
                [...imageGallery, ...images],
            );

            onUploadImageGallery(currentGalleryImages);
        },
        [imageGallery, onUploadImageGallery],
    );

    const handleOnDelete = useCallback(async (galleryId: string) => {
        const currentGalleryImages = imageGallery;

        const updatedGalleryImages = currentGalleryImages.filter(
            (image) => image.id !== galleryId,
        );

        const galleryImagesTemp = getMediaContentsApiArray(updatedGalleryImages);

        onUploadImageGallery(galleryImagesTemp);
    }, [imageGallery, onUploadImageGallery]);

    return (
        <div className={className}>
            <ImagesUploader
                uploadedImgs={imgs}
                onUpload={handleOnUpload}
                onDelete={handleOnDelete}
                onError={() => {}}
            />
        </div>
    );
};
