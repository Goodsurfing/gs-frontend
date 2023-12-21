import React from "react";

import { mockedArticlesData } from "@/entities/Article/model/data/mockedArticleData";

import { ArticlesList } from "../ArticlesList/ArticlesList";
import styles from "./VolunteerArticlesPage.module.scss";

const VolunteerArticlesPage = () => (
    <div className={styles.wrapper}>
        <h2>Мои статьи</h2>
        <ArticlesList articles={mockedArticlesData} className={styles.container} />
    </div>
);

export default VolunteerArticlesPage;
