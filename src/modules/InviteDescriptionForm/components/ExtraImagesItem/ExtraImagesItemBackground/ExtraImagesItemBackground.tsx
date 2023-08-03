import React, { FC } from "react";

import plusIcon from "@/shared/assets/icons/offer-create/plus.svg";

import styles from "./ExtraImagesItemBackground.module.scss";

const ExtraImagesItemBackground: FC = () => (
    <div className={styles.backgroundWrapper}>
        <img className={styles.backgroundImg} src={plusIcon} alt="photo" />
        <p className={styles.backgroundText}>Добавить фото</p>
    </div>
);

export default ExtraImagesItemBackground;
