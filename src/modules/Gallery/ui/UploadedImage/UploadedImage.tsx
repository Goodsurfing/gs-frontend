/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { FC, useCallback } from "react";

import closeBtnImg from "@/shared/assets/icons/delete.svg";

import styles from "./UploadedImage.module.scss";

interface UploadedImageProps {
    img: File;
    onCloseClick?: () => void;
    onImageClick?: () => void;
}

const UploadedImage: FC<UploadedImageProps> = ({ img, onCloseClick, onImageClick }) => {
    const onEnterClick = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            onImageClick?.();
        }
    }, [onImageClick]);

    return (
        <div className={styles.wrapper}>
            <img
                className={styles.img}
                src={img}
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

export default UploadedImage;
