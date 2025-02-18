import React, { FC, useCallback } from "react";

import { ReactSVG } from "react-svg";
import closeBtnImg from "@/shared/assets/icons/delete.svg";

import styles from "./UploadedCertificate.module.scss";
import fileIcon from "@/shared/assets/icons/skills/administration.svg";

interface UploadedCertificateProps {
    certificate: string;
    onCloseClick?: () => void;
    onImageClick?: () => void;
    isFile: boolean;
}

export const UploadedCertificate: FC<UploadedCertificateProps> = ({
    certificate,
    isFile,
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

    if (isFile) {
        return (
            <div className={styles.wrapper}>
                <div
                    className={styles.file}
                    onClick={onImageClick}
                >
                    <div className={styles.fileWrapper}>
                        <ReactSVG src={fileIcon} />
                    </div>
                </div>
                <button
                    className={styles.closeBtn}
                    onClick={onCloseClick}
                    type="button"
                >
                    <img src={closeBtnImg} alt="close" />
                </button>
            </div>
        );
    }

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
