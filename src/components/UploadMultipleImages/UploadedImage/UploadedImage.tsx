/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { FC, useCallback } from "react";

import styles from "./UploadedImage.module.scss";

interface UploadedImageProps {
    img: string;
    onBtnClick?: () => void;
    onImageClick?: () => void;
}

const UploadedImage: FC<UploadedImageProps> = ({ img, onBtnClick, onImageClick }) => {
    const onEscapeClick = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onBtnClick?.();
        }
    }, [onBtnClick]);

    return (
        <div className={styles.wrapper}>
            <img
                className={styles.img}
                src={img}
                alt="your upload"
                onClick={onImageClick}
                onKeyDown={onEscapeClick}
            />
            <button
                className={styles.closeBtn}
                onClick={onBtnClick}
                type="button"
            >
                x
            </button>
        </div>
    );
};

export default UploadedImage;
