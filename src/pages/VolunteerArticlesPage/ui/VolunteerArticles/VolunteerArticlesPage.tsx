import React from "react";

import { useTranslation } from "react-i18next";
import { mockedArticlesData } from "@/entities/Article/model/data/mockedArticleData";

import { ArticlesList } from "../ArticlesList/ArticlesList";
import styles from "./VolunteerArticlesPage.module.scss";

const VolunteerArticlesPage = () => {
    const { t } = useTranslation("volunteer");
    return (
        <div className={styles.wrapper}>
            <h2>{t("volunteer-articles.Мои статьи")}</h2>
            <ArticlesList articles={mockedArticlesData} className={styles.container} />
        </div>
    );
};

export default VolunteerArticlesPage;
