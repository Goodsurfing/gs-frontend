import cn from "classnames";
import React, {
    FC, useCallback, useEffect, useState,
} from "react";

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
    const [uploadedCertificates, setUploadedSertificates] = useState<MediaObjectType[]>(
        [],
    );
    const [toast, setToast] = useState<ToastAlert>();
    const { data: volunteerData } = useGetVolunteerByIdQuery(profileId);
    const [updateVolunteer] = useUpdateVolunteerByIdMutation();

    const handleUpdateCertificates = useCallback(
        (uploadedFile: MediaObjectType) => {
            const uploadedFiles = [...uploadedCertificates, uploadedFile];
            const preparedData = uploadedFiles.map((certificate) => certificate["@id"]);
            updateVolunteer({
                profileId,
                body: { certificates: preparedData },
            });
        },
        [profileId, updateVolunteer, uploadedCertificates],
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
                    text: "Произошла ошибка",
                    type: HintType.Error,
                });
            }
        },
        [handleUpdateCertificates],
    );

    useEffect(() => {
        if (volunteerData) {
            setUploadedSertificates(volunteerData.certificates);
        }
    }, [volunteerData]);

    const handleDeleteImg = useCallback((index: number) => {
        setUploadedSertificates((items) => items.filter((_, i) => i !== index));
    }, []);

    const renderCertificates = () => uploadedCertificates.map((file, index) => (
        <UploadedCertificate
            onCloseClick={() => handleDeleteImg(index)}
            key={file.contentUrl}
            certificate={getMediaContent(file) ?? ""}
            isFile
        />
    ));

    return (
        <div className={cn(className, styles.wrapper)}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.images}>
                {renderCertificates()}
                <UploadButton onUpload={uploadCertificates} id={id} />
            </div>
        </div>
    );
};
