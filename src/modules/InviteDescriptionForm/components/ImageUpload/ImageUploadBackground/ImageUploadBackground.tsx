import React from "react";

import photoDarkIcon from "@assets/icons/offer-create/photo-camera-dark.svg";

import styles from "./ImageUploadBackground.module.scss";

const ImageUploadBackground = () => {
    return (
        <div className={styles.backgroundWrapper}>
            <img className={styles.backgroundImg} src={photoDarkIcon} alt="photo" />
            <p className={styles.backgroundText}>Добавить фото обложки</p>
        </div>
    );
};

export default ImageUploadBackground;
