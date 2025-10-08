import cn from "classnames";
import React, {
    FC, useCallback, useEffect, useState,
} from "react";

import { useTranslation } from "react-i18next";
import {
    useGetVolunteerByIdQuery,
    useUpdateVolunteerByIdMutation,
} from "@/entities/Volunteer";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import { MediaObjectType } from "@/types/media";
import { ImagesUploader } from "@/shared/ui/ImagesUploader/ImagesUploader";

interface VolunteerCertificateGalleryProps {
    className?: string;
    profileId: string;
}

export const VolunteerCertificateGallery: FC<VolunteerCertificateGalleryProps> = ({
    className,
    profileId,
}) => {
    const { t } = useTranslation("volunteer");
    const [uploadedCertificates, setUploadedSertificates] = useState<MediaObjectType[]>(
        [],
    );
    const [toast, setToast] = useState<ToastAlert>();
    const { data: volunteerData } = useGetVolunteerByIdQuery(profileId);
    const [updateVolunteer] = useUpdateVolunteerByIdMutation();

    useEffect(() => {
        if (volunteerData) {
            setUploadedSertificates(volunteerData.certificates);
        } else {
            setUploadedSertificates([]);
        }
    }, [volunteerData]);

    const handleOnUpload = useCallback(
        async (files: MediaObjectType[]) => {
            setToast(undefined);
            const uploadedFiles = [...uploadedCertificates, ...files];
            const preparedData = uploadedFiles.map((certificate) => certificate["@id"]);
            try {
                await updateVolunteer({
                    profileId,
                    body: { certificates: preparedData },
                }).unwrap();
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
        [profileId, t, updateVolunteer, uploadedCertificates],
    );

    const handleOnDelete = useCallback(async (fileId: string) => {
        setToast(undefined);
        const tempUploadedSertificates = uploadedCertificates.filter((file) => file["@id"] !== fileId);
        const preparedData = tempUploadedSertificates.map((certificate) => certificate["@id"]);
        updateVolunteer({
            profileId,
            body: { certificates: preparedData },
        });
    }, [profileId, updateVolunteer, uploadedCertificates]);

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
