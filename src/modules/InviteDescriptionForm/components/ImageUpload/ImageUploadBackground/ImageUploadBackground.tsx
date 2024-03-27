import React, { FC } from "react";

import photoDarkIcon from "@/shared/assets/icons/offer-create/photo-camera-dark.svg";

import styles from "./ImageUploadBackground.module.scss";

interface ImageUploadBackgroundProps {
    text: string;
}

const ImageUploadBackground: FC<ImageUploadBackgroundProps> = (
    props: ImageUploadBackgroundProps,
) => {
    const { text } = props;

    return (
        <div className={styles.backgroundWrapper}>
            <img
                className={styles.backgroundImg}
                src={photoDarkIcon}
                alt="uploaded"
            />
            <p className={styles.backgroundText}>{text}</p>
        </div>
    );
};

export default ImageUploadBackground;
