import React from "react";

import { useTranslation } from "react-i18next";
import styles from "./Header.module.scss";

export const Header = () => {
    const { t } = useTranslation("membership");

    return (
        <section className={styles.wrapper}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    <span className={styles.titleLine}>
                        {t("header.title-line-1", "Стань частью сообщества Гудсёрфинга,")}
                    </span>
                    <span className={styles.titleLine}>
                        {t("header.title-line-2", "путешествуй со смыслом и помогай проекту,")}
                    </span>
                    <span className={styles.titleLine}>
                        {t("header.title-line-3", "который делает это возможным.")}
                    </span>
                </h1>
                <p className={styles.description}>
                    {t(
                        "header.desc1",
                        "Гудсёрфинг — членская организация, которая работает благодаря людям, которые его поддерживают.",
                    )}
                </p>
                <p className={styles.description}>
                    {t(
                        "header.desc2",
                        "Членство — это способ не просто пользоваться проектом, а помогать ему жить и развиваться.",
                    )}
                </p>
                <div className={styles.buttons}>
                    <a href="#tariffs" className={styles.btnPrimary}>
                        {t("header.cta-main", "Получить членство")}
                    </a>
                    <a href="#support" className={styles.btnSecondary}>
                        {t("header.cta-secondary", "Поддержать без членства")}
                    </a>
                </div>
            </div>
        </section>
    );
};
