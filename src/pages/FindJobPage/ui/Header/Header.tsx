import React from "react";

import { useTranslation } from "react-i18next";
import styles from "./Header.module.scss";
import Button from "@/shared/ui/Button/Button";

export const Header = () => {
    const { t } = useTranslation("find-job");
    return (
        <section className={styles.wrapeprImage}>
            <h1 className={styles.title}>{t("Совмещай работу и путешествие!")}</h1>
            <h2 className={styles.description}>
                {t("Выездная сезонная работа на море, в горах и на природе!")}
            </h2>
            <div className={styles.buttonPrice}>
                <Button color="GREEN" size="SMALL" variant="FILL">
                    {t("Найти работу")}
                </Button>
            </div>
        </section>
    );
};
