import photoDarkIcon from "@assets/icons/offer-create/photo-camera-dark.svg";
import React from "react";

import styles from "./ImageUploadBackground.module.scss";

const ImageUploadBackground = () => (
    <div className={styles.backgroundWrapper}>
        <img className={styles.backgroundImg} src={photoDarkIcon} alt="bg" />
        <p className={styles.backgroundText}>Добавить фото обложки</p>
    </div>
);

export default ImageUploadBackground;
