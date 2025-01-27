import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.scss";

export const Header = () => {
    const { t } = useTranslation("ambassadors");

    return (
        <section className={styles.wrapper}>
            <h1 className={styles.title}>{t("Амбассадоры ГудСёрфинга")}</h1>
        </section>
    );
};
