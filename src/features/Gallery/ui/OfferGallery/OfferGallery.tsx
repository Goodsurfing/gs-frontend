import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
    useCreateOfferGalleryItemMutation,
    useDeleteOfferGalleryItemMutation, useGetOfferGalleryItemsQuery,
} from "@/entities/Offer/api/offerApi";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { ImagesUploader } from "@/shared/ui/ImagesUploader/ImagesUploader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { GalleryItem, MediaObjectType } from "@/types/media";
import { getMediaContentsApiArray } from "@/shared/lib/getMediaContent";

interface OfferGalleryProps {
    className?: string;
    offerId: string;
}

export const OfferGallery: FC<OfferGalleryProps> = (props) => {
    const { offerId, className } = props;

    const { t } = useTranslation("volunteer");
    const [createGalleryItem] = useCreateOfferGalleryItemMutation();
    const [deleteGalleryItem] = useDeleteOfferGalleryItemMutation();
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
            const currentGalleryImages = getMediaContentsApiArray([...images]);

            try {
                await Promise.all(
                    currentGalleryImages.map(async (imgUrl) => {
                        const formData = new FormData();
                        formData.append("mediaObject", imgUrl);

                        await createGalleryItem({
                            offerId,
                            formData,
                        }).unwrap();
                    }),
                );

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
        [createGalleryItem, offerId, t],
    );

    const handleOnDelete = useCallback(async (galleryId: string) => {
        await deleteGalleryItem({ offerId, galleryId })
            .unwrap()
            .then(() => {
                setToast({
                    text: t("volunteer-gallery.Галерея успешно обновлена"),
                    type: HintType.Success,
                });
            })
            .catch(() => {
                setToast({
                    text: t("volunteer-gallery.Произошла ошибка с обновлением галереи"),
                    type: HintType.Error,
                });
            });
    }, [deleteGalleryItem, offerId, t]);

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
