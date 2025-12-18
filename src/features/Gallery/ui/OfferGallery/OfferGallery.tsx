import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
    useGetOfferGalleryItemsQuery,
    useUpdateOfferImageGalleryMutation,
} from "@/entities/Offer/api/offerApi";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { ImagesUploader } from "@/shared/ui/ImagesUploader/ImagesUploader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { GalleryItem, Image, MediaObjectType } from "@/types/media";
import { getMediaContentsApiArray } from "@/shared/lib/getMediaContent";

interface OfferGalleryProps {
    className?: string;
    offerId: string;
    offerImageGallery?: Image[];
}

export const OfferGallery: FC<OfferGalleryProps> = (props) => {
    const { offerId, className, offerImageGallery = [] } = props;

    const { t } = useTranslation("volunteer");
    const [updateOfferImageGallery] = useUpdateOfferImageGalleryMutation();
    // const [createGalleryItem] = useCreateOfferGalleryItemMutation();
    // const [deleteGalleryItem] = useDeleteOfferGalleryItemMutation();
    const { data: galleryData } = useGetOfferGalleryItemsQuery(offerId);

    const [imgs, setImgs] = useState<GalleryItem[]>([]);
    const [toast, setToast] = useState<ToastAlert>();

    useEffect(() => {
        if (galleryData) {
            setImgs(galleryData);
        } else {
            setImgs([]);
        }
    }, [galleryData]);

    const handleOnUpload = useCallback(
        async (images: MediaObjectType[]) => {
            const currentGalleryImages = getMediaContentsApiArray(
                [...offerImageGallery, ...images],
            );

            try {
                await updateOfferImageGallery({
                    offerId: Number(offerId),
                    body: { galleryImageIds: currentGalleryImages },
                }).unwrap();

                setToast({
                    text: t("volunteer-gallery.Галерея успешно обновлена"),
                    type: HintType.Success,
                });
            } catch {
                setToast({
                    text: t("volunteer-gallery.Произошла ошибка с обновлением галереи"),
                    type: HintType.Error,
                });
            }
        },
        [offerId, offerImageGallery, t, updateOfferImageGallery],
    );

    const handleOnDelete = useCallback(async (galleryId: string) => {
        const currentGalleryImages = offerImageGallery;

        const updatedGalleryImages = currentGalleryImages.filter(
            (image) => image.id !== galleryId,
        );

        const galleryImagesTemp = getMediaContentsApiArray(updatedGalleryImages);

        try {
            await updateOfferImageGallery({
                offerId: Number(offerId),
                body: { galleryImageIds: galleryImagesTemp },
            }).unwrap();
            setToast({
                text: t("volunteer-gallery.Галерея успешно обновлена"),
                type: HintType.Success,
            });
        } catch {
            setToast({
                text: t("volunteer-gallery.Произошла ошибка с обновлением галереи"),
                type: HintType.Error,
            });
        }
    }, [offerId, offerImageGallery, t, updateOfferImageGallery]);

    return (
        <div className={className}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <ImagesUploader
                uploadedImgs={imgs}
                onUpload={handleOnUpload}
                onDelete={handleOnDelete}
                onError={() => {}}
            />
        </div>
    );
};
