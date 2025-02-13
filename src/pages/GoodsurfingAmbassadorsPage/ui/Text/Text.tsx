import React from "react";

import { useTranslation } from "react-i18next";
import styles from "./Text.module.scss";

export const Text = () => {
    const { t } = useTranslation("ambassadors");

    return (
        <div className={styles.wrapper}>
            <h2>{t("Эксперты в путешествиях со смыслом")}</h2>
            <p>
                {t("Амбассадоры Гудсёрфинга - люди, которые")}
                <br />
                {t("Если вы также готовы нести идеи Гудсёрфинга людям — вам предоставляется отличная возможность вступить в ряды Амбассадоров!")}
            </p>
        </div>
    );
};
