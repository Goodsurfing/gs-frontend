import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { ImagesUploader } from "@/shared/ui/ImagesUploader/ImagesUploader";
import { Image, MediaObjectType } from "@/types/media";
import { getMediaContentsApiArray } from "@/shared/lib/getMediaContent";
import styles from "./OfferGallery.module.scss";

interface OfferGalleryProps {
    label?: string;
    className?: string;
    imageGallery?: Image[];
    onUploadImageGallery?: (data: string[]) => void;
    onChangeImageGallery?: (data: Image[]) => void;
}

export const OfferGallery: FC<OfferGalleryProps> = (props) => {
    const {
        className, imageGallery = [],
        onUploadImageGallery, onChangeImageGallery, label,
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
            const updatedGalleryImages = [...imageGallery, ...images];
            const currentGalleryImages = getMediaContentsApiArray(
                updatedGalleryImages,
            );

            onUploadImageGallery?.(currentGalleryImages);
            onChangeImageGallery?.(updatedGalleryImages);
        },
        [imageGallery, onChangeImageGallery, onUploadImageGallery],
    );

    const handleOnDelete = useCallback(async (galleryId: string) => {
        const currentGalleryImages = imageGallery;

        const updatedGalleryImages = currentGalleryImages.filter(
            (image) => image.id !== galleryId,
        );

        const galleryImagesTemp = getMediaContentsApiArray(updatedGalleryImages);

        onUploadImageGallery?.(galleryImagesTemp);
        onChangeImageGallery?.(updatedGalleryImages);
    }, [imageGallery, onChangeImageGallery, onUploadImageGallery]);

    return (
        <div className={className}>
            {label && (
                <span className={styles.label}>
                    {label}
                </span>
            )}
            <ImagesUploader
                uploadedImgs={imgs}
                onUpload={handleOnUpload}
                onDelete={handleOnDelete}
                onError={() => {}}
            />
        </div>
    );
};
