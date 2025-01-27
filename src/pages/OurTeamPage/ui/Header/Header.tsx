import React from "react";

import { useTranslation } from "react-i18next";
import styles from "./Header.module.scss";

export const Header = () => {
    const { t } = useTranslation("our-team");
    return (
        <section className={styles.wrapper}>
            <h1 className={styles.title}>{t("Наша команда")}</h1>
        </section>
    );
};
