import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ImagesUploader } from "@/shared/ui/ImagesUploader/ImagesUploader";
import { MediaObjectType } from "@/types/media";
import { getHostMediaContentsApiArray, getMediaContentsApiArray } from "@/shared/lib/getMediaContent";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Host, useUpdateHostMutation } from "@/entities/Host";

interface HostGalleryProps {
    className?: string;
    hostData: Host;
}

export const HostGallery: FC<HostGalleryProps> = (props) => {
    const { hostData, className } = props;

    const { t } = useTranslation("volunteer");
    const [updateHost] = useUpdateHostMutation();
    const [imgs, setImgs] = useState<MediaObjectType[]>([]);
    const [toast, setToast] = useState<ToastAlert>();

    useEffect(() => {
        if (hostData) {
            setImgs(hostData.galleryImages);
        } else {
            setImgs([]);
        }
    }, [hostData]);

    const handleOnUpload = useCallback(async (images: MediaObjectType[]) => {
        setToast(undefined);
        const currentGalleryImages = getHostMediaContentsApiArray(
            [...hostData.galleryImages, ...images],
        );
        try {
            await updateHost({
                id: hostData.id,
                body: {
                    galleryImages: [
                        ...currentGalleryImages,
                    ],
                },
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
    }, [hostData.galleryImages, hostData.id, updateHost, t]);

    const handleOnDelete = useCallback(async (mediaObjectUrl: string) => {
        setToast(undefined);
        const currentGalleryImages = hostData.galleryImages;

        const updatedGalleryImages = currentGalleryImages.filter(
            (image) => image["@id"] !== mediaObjectUrl,
        );

        await updateHost({
            id: hostData.id,
            body: {
                galleryImages: getMediaContentsApiArray(updatedGalleryImages),
            },
        }).unwrap()
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
    }, [hostData.galleryImages, hostData.id, updateHost, t]);

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
