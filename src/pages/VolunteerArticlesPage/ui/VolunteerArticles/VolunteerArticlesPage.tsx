import React from "react";

import { useTranslation } from "react-i18next";

import { ArticlesList } from "../ArticlesList/ArticlesList";
import styles from "./VolunteerArticlesPage.module.scss";

const VolunteerArticlesPage = () => {
    const { t } = useTranslation("volunteer");
    return (
        <div className={styles.wrapper}>
            <h2>{t("volunteer-articles.Мои статьи")}</h2>
            <ArticlesList articles={[]} className={styles.container} />
        </div>
    );
};

export default VolunteerArticlesPage;
