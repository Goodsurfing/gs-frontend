import React from "react";

import { useTranslation } from "react-i18next";
import styles from "./TitleGallery.module.scss";

export const TitleGallery = () => {
    const { t } = useTranslation("volunteer");
    return (
        <div className={styles.wrapper}>
            <h2>{t("volunteer-gallery.Ваши фотографии")}</h2>
            <p className={styles.description}>
                {t(`volunteer-gallery.${"Добавьте несколько ваших фотографий, которые помогут больше о вас понять. Например, это фотографии где вы были, примеры как вы успешно справлялись с задачами или ваши встречи с другими гудсёрферами."}`)}
            </p>
        </div>
    );
};
