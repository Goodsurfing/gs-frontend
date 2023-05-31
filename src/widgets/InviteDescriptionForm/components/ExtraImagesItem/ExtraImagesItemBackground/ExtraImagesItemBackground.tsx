import plusIcon from "@assets/icons/offer-create/plus.svg";
import React, { FC } from "react";

import styles from "./ExtraImagesItemBackground.module.scss";

const ExtraImagesItemBackground: FC = () => (
    <div className={styles.backgroundWrapper}>
        <img
            className={styles.backgroundImg}
            src={plusIcon}
            alt="background"
        />
        <p className={styles.backgroundText}>Добавить фото</p>
    </div>
);

export default ExtraImagesItemBackground;
