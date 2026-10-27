import cn from "classnames";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ArticleCardType } from "@/entities/Article";
import { ArticleCard } from "@/entities/Article/";

import { getBlogPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Text } from "@/shared/ui/Text/Text";

import styles from "./ArticlesList.module.scss";

interface ArticlesListProps {
    data?: ArticleCardType[];
    className?: string;
}

export const ArticlesList: FC<ArticlesListProps> = (props) => {
    const { data, className } = props;
    const { locale } = useLocale();
    const { t } = useTranslation("blog");

    const renderNews = useMemo(
        () => data?.map((article, key) => (
            <ArticleCard
                article={article}
                key={key}
                className={styles.article}
                path={getBlogPersonalPageUrl(locale, article.slug)}
            />
        )),
        [data, locale],
    );

    if (!data) {
        return null;
    }

    if (data.length === 0) {
        return (
            <Text
                className={styles.empty}
                textSize="primary"
                text={t("Статьи не найдены")}
            />
        );
    }

    return <div className={cn(className, styles.wrapper)}>{renderNews}</div>;
};
