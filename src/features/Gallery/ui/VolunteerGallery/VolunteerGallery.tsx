import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ImagesUploader } from "@/shared/ui/ImagesUploader/ImagesUploader";
import { useUpdateProfileInfoMutation } from "@/entities/Profile/api/profileApi";
import { useGetVolunteerByIdQuery } from "@/entities/Volunteer";
import { MediaObjectType } from "@/types/media";
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
    const [updateProfile] = useUpdateProfileInfoMutation();
    const { refetch: refetchVolunteer } = useGetVolunteerByIdQuery(profileData.id);
    const [imgs, setImgs] = useState<MediaObjectType[]>([]);
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
            await updateProfile({
                userId: profileData.id,
                profileData: {
                    galleryImages: [
                        ...currentGalleryImages,
                    ],
                },
            }).unwrap();
            refetchVolunteer();
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
    }, [profileData.galleryImages, profileData.id,
        refetchVolunteer, updateProfile, t]);

    const handleOnDelete = useCallback(async (mediaObjectUrl: string) => {
        const currentGalleryImages = profileData.galleryImages;

        const updatedGalleryImages = currentGalleryImages.filter(
            (image) => image["@id"] !== mediaObjectUrl,
        );

        await updateProfile({
            userId: profileData.id,
            profileData: {
                galleryImages: getMediaContentsApiArray(updatedGalleryImages),
            },
        })
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
    }, [profileData.galleryImages, profileData.id, updateProfile, t]);

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
