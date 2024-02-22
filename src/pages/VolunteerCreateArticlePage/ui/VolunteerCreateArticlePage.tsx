import React from "react";

import { useTranslation } from "react-i18next";
import { ArticleForm } from "@/features/ArticleForm";
import styles from "./VolunteerCreateArticlePage.module.scss";

const VolunteerCreateArticlePage = () => {
    const { t } = useTranslation("volunteer");
    return (
        <div className={styles.wrapper}>
            <h2>{t("volunteer-create-article.Написать в блог")}</h2>
            <ArticleForm className={styles.articleForm} />
        </div>
    );
};

export default VolunteerCreateArticlePage;
