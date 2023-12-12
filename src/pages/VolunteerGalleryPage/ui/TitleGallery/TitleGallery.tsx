import React from "react";

import styles from "./TitleGallery.module.scss";

export const TitleGallery = () => (
    <div className={styles.wrapper}>
        <h2>Ваши фотографии</h2>
        <p className={styles.description}>
            Добавьте несколько ваших фотографий, которые помогут больше о вас
            понять. Например, это фотографии где вы были, примеры как вы успешно
            справлялись с задачами или ваши встречи с другими гудсёрферами.
        </p>
    </div>
);
