import React, { FC, useEffect, useState } from "react";
import { UploadMultipleImages } from "@/modules/Gallery";

import { useGetProfileInfoQuery } from "@/entities/Profile";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

interface VolunteerGalleryFormProps {
    className?: string;
}

export const VolunteerGalleryForm: FC<VolunteerGalleryFormProps> = (props) => {
    const { className } = props;
    const { data: profileData } = useGetProfileInfoQuery();

    const [isGalleryLoading, setGalleryLoading] = useState<boolean>(false);
    const [isGalleryError, setGalleryError] = useState<boolean>(false);
    const [isGallerySuccess, setGallerySuccess] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastAlert>();

    useEffect(() => {
        setToast(undefined);
        if (isGalleryError) {
            setToast({
                text: "Произошла ошибка с обновлением галереи",
                type: HintType.Error,
            });
        }
        if (isGallerySuccess) {
            setToast({
                text: "Галерея успешно обновлена",
                type: HintType.Success,
            });
        }
    }, [isGalleryError, isGallerySuccess]);

    const handleGalleryLoading = (value: boolean) => {
        setGalleryLoading(value);
    };

    const handleGalleryError = (value: boolean) => {
        setGalleryError(value);
    };

    const handleGallerySuccess = (value: boolean) => {
        setGallerySuccess(value);
    };

    if (!profileData) return null;

    return (
        <>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <UploadMultipleImages
                profileData={profileData}
                label="Добавить фото"
                isLoading={isGalleryLoading}
                onChangeLoading={handleGalleryLoading}
                onChangeError={handleGalleryError}
                onChangeSuccess={handleGallerySuccess}
                className={className}
            />
        </>
    );
};
