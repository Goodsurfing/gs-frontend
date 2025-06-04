import React, { memo } from "react";

import { useTranslation } from "react-i18next";
import styles from "./Text.module.scss";

export const Text = memo(() => {
    const { t } = useTranslation("host");
    return (
        <div>
            <h4 className={styles.title}>
                {t("hostVideo.Видеогалерея организации")}
            </h4>
            <p className={styles.description}>
                {t("hostVideo.Добавьте ссылки на видеоролики с Youtube или Vimeo")}
            </p>
        </div>
    );
});
