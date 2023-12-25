/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { FC, useCallback } from "react";

import closeBtnImg from "@/shared/assets/icons/delete.svg";

import styles from "./UploadedCertificate.module.scss";

interface UploadedCertificateProps {
    certificate: string;
    onCloseClick?: () => void;
    onImageClick?: () => void;
}

export const UploadedCertificate: FC<UploadedCertificateProps> = ({
    certificate,
    onCloseClick,
    onImageClick,
}) => {
    const onEnterClick = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                onImageClick?.();
            }
        },
        [onImageClick],
    );

    return (
        <div className={styles.wrapper}>
            <img
                className={styles.img}
                src={certificate}
                alt="your upload"
                onClick={onImageClick}
                onKeyDown={onEnterClick}
            />
            <button
                className={styles.closeBtn}
                onClick={onCloseClick}
                type="button"
            >
                <img src={closeBtnImg} alt="close" />
            </button>
        </div>
    );
};
