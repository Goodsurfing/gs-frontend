import React, { FC, useEffect, useState } from "react";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { useGetMyHostQuery } from "@/entities/Host";
import { HostUploadMultipleImages } from "@/modules/Gallery/ui/HostUploadMultipleImages/HostUploadMultipleImages";

interface HostGalleryFormProps {
    className?: string;
}

export const HostGalleryForm: FC<HostGalleryFormProps> = (props) => {
    const { className } = props;
    const { data: myHost } = useGetMyHostQuery();

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

    if (!myHost) return null;

    return (
        <>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <HostUploadMultipleImages
                host={myHost}
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
