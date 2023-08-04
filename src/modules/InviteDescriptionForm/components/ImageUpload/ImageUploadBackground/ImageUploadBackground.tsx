import React from "react";

import photoDarkIcon from "@/shared/assets/icons/offer-create/photo-camera-dark.svg";

import styles from "./ImageUploadBackground.module.scss";

const ImageUploadBackground = () => (
    <div className={styles.backgroundWrapper}>
        <img className={styles.backgroundImg} src={photoDarkIcon} alt="uploaded" />
        <p className={styles.backgroundText}>Добавить фото обложки</p>
    </div>
);

export default ImageUploadBackground;
