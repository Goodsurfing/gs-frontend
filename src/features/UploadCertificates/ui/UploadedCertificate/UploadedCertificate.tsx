import React, { FC, useCallback } from "react";

import { ReactSVG } from "react-svg";
import cn from "classnames";
import closeBtnImg from "@/shared/assets/icons/delete.svg";

import styles from "./UploadedCertificate.module.scss";
import fileIcon from "@/shared/assets/icons/skills/administration.svg";

interface UploadedCertificateProps {
    certificate: string;
    isFile?: boolean;
    download?: string;
    disableCloseButton?: boolean;
    onCloseClick?: () => void;
    onImageClick?: () => void;
    classNameItem?: string;
}

export const UploadedCertificate: FC<UploadedCertificateProps> = ({
    certificate,
    isFile = false,
    download,
    disableCloseButton = false,
    onCloseClick,
    onImageClick,
    classNameItem,
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
                <a
                    href={download}
                    download
                    className={cn(styles.file, classNameItem)}
                    onClick={onImageClick}
                >
                    <div className={styles.fileWrapper}>
                        <ReactSVG src={fileIcon} />
                    </div>
                </a>
                <button
                    className={cn(styles.closeBtnFile, { [styles.hidden]: disableCloseButton })}
                    onClick={onCloseClick}
                    type="button"
                >
                    <ReactSVG src={closeBtnImg} />
                </button>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <a href={certificate} download>
                <img
                    className={styles.img}
                    src={certificate}
                    alt="your upload"
                    onClick={onImageClick}
                    onKeyDown={onEnterClick}
                />
            </a>
            <button
                className={cn(styles.closeBtn, { [styles.hidden]: disableCloseButton })}
                onClick={onCloseClick}
                type="button"
            >
                <ReactSVG src={closeBtnImg} />
            </button>
        </div>
    );
};
