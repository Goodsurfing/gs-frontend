import React from "react";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { VolunteerArticleInfo } from "@/widgets/Article";
import styles from "./VolunteerArticlePersonalPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

const VolunteerArticlePersonalPage = () => {
    const { t } = useTranslation("volunteer");
    const { locale } = useLocale();
    const { id } = useParams<{ id: string; }>();

    return (
        <div className={styles.wrapper}>
            <h2>{t("volunteer-create-article.Редактировать статью")}</h2>
            {id && (
                <VolunteerArticleInfo
                    articleId={Number(id)}
                    locale={locale}
                    className={styles.articleForm}
                />
            )}
        </div>
    );
};

export default VolunteerArticlePersonalPage;
