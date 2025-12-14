import cn from "classnames";
import React, {
    FC, useCallback, useEffect, useState,
} from "react";

import { useTranslation } from "react-i18next";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import { Image, MediaObjectType } from "@/types/media";
import { ImagesUploader } from "@/shared/ui/ImagesUploader/ImagesUploader";
import { Profile, useUpdateProfileCertificatesMutation } from "@/entities/Profile";

interface VolunteerCertificateGalleryProps {
    className?: string;
    profileData: Profile;
}

export const VolunteerCertificateGallery: FC<VolunteerCertificateGalleryProps> = ({
    className,
    profileData,
}) => {
    const { t } = useTranslation("volunteer");
    const [uploadedCertificates, setUploadedSertificates] = useState<Image[]>(
        [],
    );
    const [toast, setToast] = useState<ToastAlert>();
    const [updateProfileCertificates] = useUpdateProfileCertificatesMutation();

    useEffect(() => {
        if (profileData.volunteer?.certificates) {
            setUploadedSertificates(profileData.volunteer.certificates);
        } else {
            setUploadedSertificates([]);
        }
    }, [profileData.volunteer?.certificates]);

    const handleOnUpload = useCallback(
        async (files: MediaObjectType[]) => {
            setToast(undefined);
            const uploadedFiles = [...uploadedCertificates.map(
                (uploadedCertificate) => uploadedCertificate.id,
            ), ...files.map((file) => file.id)];

            try {
                await updateProfileCertificates({ certificateIds: uploadedFiles }).unwrap();
                setToast({
                    text: t("volunteer-gallery.Диплом или сертификат были успешно добавлены"),
                    type: HintType.Success,
                });
            } catch {
                setToast({
                    text: t("volunteer-gallery.Произошла ошибка"),
                    type: HintType.Error,
                });
            }
        },
        [t, updateProfileCertificates, uploadedCertificates],
    );

    const handleOnDelete = useCallback(async (fileId: string) => {
        setToast(undefined);
        const tempUploadedSertificates = uploadedCertificates.filter((file) => file.id !== fileId);
        const preparedData = tempUploadedSertificates.map((certificate) => certificate.id);
        await updateProfileCertificates({ certificateIds: preparedData });
    }, [updateProfileCertificates, uploadedCertificates]);

    const handleOnError = useCallback((error?: string) => {
        setToast(undefined);
        if (error) {
            setToast({
                text: error,
                type: HintType.Error,
            });
        } else {
            setToast({
                text: t("volunteer-gallery.Произошла ошибка"),
                type: HintType.Error,
            });
        }
    }, [t]);

    return (
        <div className={cn(className)}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <ImagesUploader
                onUpload={handleOnUpload}
                onDelete={handleOnDelete}
                onError={handleOnError}
                uploadedImgs={uploadedCertificates}
                isOnlyImgFormat={false}
                label="Добавить сертификат"
            />
        </div>
    );
};
