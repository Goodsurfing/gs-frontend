import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ImagesUploader } from "@/shared/ui/ImagesUploader/ImagesUploader";
import { useUpdateProfileImageGalleryMutation } from "@/entities/Profile/api/profileApi";
import { Image, MediaObjectType } from "@/types/media";
import { Profile } from "@/entities/Profile";
import { getMediaContentsApiArray } from "@/shared/lib/getMediaContent";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";

interface VolunteerGalleryProps {
    className?: string;
    profileData: Profile;
}

export const VolunteerGallery: FC<VolunteerGalleryProps> = (props) => {
    const { profileData, className } = props;

    const { t } = useTranslation("volunteer");
    const [updateImageGallery] = useUpdateProfileImageGalleryMutation();
    const [imgs, setImgs] = useState<Image[]>([]);
    const [toast, setToast] = useState<ToastAlert>();

    useEffect(() => {
        if (profileData) {
            setImgs(profileData.galleryImages);
        } else {
            setImgs([]);
        }
    }, [profileData]);

    const handleOnUpload = useCallback(async (images: MediaObjectType[]) => {
        const currentGalleryImages = getMediaContentsApiArray(
            [...profileData.galleryImages, ...images],
        );

        try {
            await updateImageGallery({
                galleryImageIds: [...currentGalleryImages],
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
    }, [profileData.galleryImages, updateImageGallery, t]);

    const handleOnDelete = useCallback(async (mediaObjectUrl: string) => {
        const currentGalleryImages = profileData.galleryImages;

        const updatedGalleryImages = currentGalleryImages.filter(
            (image) => image.id !== mediaObjectUrl,
        );

        try {
            await updateImageGallery({
                galleryImageIds: getMediaContentsApiArray(updatedGalleryImages),
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
    }, [profileData.galleryImages, updateImageGallery, t]);

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
