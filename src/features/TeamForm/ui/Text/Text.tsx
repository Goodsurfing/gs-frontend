/* eslint-disable max-len */
import React, { memo } from "react";

import { useTranslation } from "react-i18next";
import styles from "./Text.module.scss";

export const Text = memo(() => {
    const { t } = useTranslation("host");

    return (
        <div>
            <h4 className={styles.title}>
                {t("hostTeam.Команда организации")}
            </h4>
            <p className={styles.description}>
                {t("hostTeam.Владельцы команд могут добавлять участников в команду своей организации, добавляя их адреса электронной почты. У них должна быть учетная запись на сайте.")}
            </p>

        </div>
    );
});
