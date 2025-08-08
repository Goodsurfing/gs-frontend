import cn from "classnames";
import React, {
    FC, useCallback, useEffect, useState,
} from "react";

import { useTranslation } from "react-i18next";
import {
    useGetVolunteerByIdQuery,
    useUpdateVolunteerByIdMutation,
} from "@/entities/Volunteer";

import uploadFile from "@/shared/hooks/files/useUploadFile";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { UploadButton } from "../UploadButton/UploadButton";
import { UploadedCertificate } from "../UploadedCertificate/UploadedCertificate";
import styles from "./UploadCertificates.module.scss";
import { MediaObjectType } from "@/types/media";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { createLink } from "@/shared/lib/createLink";

interface UploadCertificateProps {
    className?: string;
    id: string;
    profileId: string;
}

export const UploadCertificates: FC<UploadCertificateProps> = ({
    className,
    id,
    profileId,
}) => {
    const { t } = useTranslation("volunteer");
    const [uploadedCertificates, setUploadedSertificates] = useState<MediaObjectType[]>(
        [],
    );
    const [toast, setToast] = useState<ToastAlert>();
    const { data: volunteerData } = useGetVolunteerByIdQuery(profileId);
    const [updateVolunteer] = useUpdateVolunteerByIdMutation();
    const canUpload = uploadedCertificates.length < 11;

    const handleUpdateCertificates = useCallback(
        async (uploadedFile: MediaObjectType) => {
            try {
                const uploadedFiles = [...uploadedCertificates, uploadedFile];
                const preparedData = uploadedFiles.map((certificate) => certificate["@id"]);
                await updateVolunteer({
                    profileId,
                    body: { certificates: preparedData },
                }).unwrap();
                setToast({
                    text: t("volunteer-gallery.Диплом или сертификат были успешно добавлены"),
                    type: HintType.Success,
                });
            } catch (error) {
                setToast({
                    text: t("volunteer-gallery.Произошла ошибка"),
                    type: HintType.Error,
                });
            }
        },
        [profileId, updateVolunteer, uploadedCertificates, t],
    );

    const uploadCertificates = useCallback(
        async (file: File) => {
            try {
                const result = await uploadFile(file.name, file);
                if (result === null) throw new Error();
                if (result) {
                    handleUpdateCertificates(result);
                }
            } catch (error) {
                setToast({
                    text: t("volunteer-gallery.Произошла ошибка"),
                    type: HintType.Error,
                });
            }
        },
        [handleUpdateCertificates, t],
    );

    useEffect(() => {
        if (volunteerData) {
            setUploadedSertificates(volunteerData.certificates);
        }
    }, [volunteerData]);

    const handleDeleteSetificate = useCallback((index: number) => {
        const tempUploadedSertificates = uploadedCertificates.filter((_, i) => i !== index);
        const preparedData = tempUploadedSertificates.map((certificate) => certificate["@id"]);
        updateVolunteer({
            profileId,
            body: { certificates: preparedData },
        });
    }, [profileId, updateVolunteer, uploadedCertificates]);

    const renderCertificates = () => uploadedCertificates.map((file, index) => (
        <UploadedCertificate
            onCloseClick={() => handleDeleteSetificate(index)}
            key={file.contentUrl}
            certificate={getMediaContent(file) ?? ""}
            download={createLink(file.contentUrl)}
            isFile
        />
    ));

    return (
        <div className={cn(className, styles.wrapper)}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.images}>
                {renderCertificates()}
                <UploadButton onUpload={uploadCertificates} id={id} disabled={!canUpload} />
            </div>
        </div>
    );
};
