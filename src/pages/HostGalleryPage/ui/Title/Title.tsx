import React from "react";

import { useTranslation } from "react-i18next";
import styles from "./Title.module.scss";

export const Title = () => {
    const { t } = useTranslation("host");

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{t("hostGallery.Фотогалерея организации")}</h1>
            <p className={styles.text}>
                {t("hostGallery.Добавьте сюда не менее 6 фотографий")}
            </p>
        </div>
    );
};
