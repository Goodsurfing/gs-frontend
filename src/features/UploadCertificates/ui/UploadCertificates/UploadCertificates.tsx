/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useCallback, useState } from "react";
import cn from "classnames";

import { UploadButton } from "../UploadButton/UploadButton";

import { UploadedCertificate } from "../UploadedCertificate/UploadedCertificate";

import styles from "./UploadCertificates.module.scss";

interface UploadCertificateProps {
    className?: string;
    id: string;
    onUpload?: (img: string) => void;
}

export const UploadCertificates: FC<UploadCertificateProps> = ({
    className,
    id,
    onUpload,
}) => {
    const [uploadedImg, setUploadedImg] = useState<string[]>([]);

    const handleUpdateImages = useCallback((image: File) => {
        onUpload?.(image.name);
    }, [onUpload]);

    const handleDeleteImg = useCallback((index: number) => {
        setUploadedImg((items) => items.filter((_, i) => i !== index));
    }, []);

    return (
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.images}>
                {uploadedImg.map((img, index) => (
                    <UploadedCertificate
                        onCloseClick={() => handleDeleteImg(index)}
                        key={img}
                        certificate={img}
                    />
                ))}
                <UploadButton onUpload={handleUpdateImages} id={id} />
            </div>
        </div>
    );
};
