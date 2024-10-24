import cn from "classnames";
import React, { FC, useMemo } from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Article } from "@/entities/Article";
import { ArticleCard } from "@/entities/Article/";

import { getBlogPersonalPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./ArticlesList.module.scss";

interface ArticlesListProps {
    data?: Article[];
    className?: string;
}

export const ArticlesList: FC<ArticlesListProps> = (props) => {
    const { data, className } = props;
    const { locale } = useLocale();

    const renderNews = useMemo(
        () => data?.map((article, key) => (
            <ArticleCard
                article={article}
                key={key}
                className={styles.article}
                path={getBlogPersonalPageUrl(locale, article.id.toString())}
            />
        )),
        [data, locale],
    );

    if (!data) {
        return <div>Статей не было найдено</div>;
    }

    return <div className={cn(className, styles.wrapper)}>{renderNews}</div>;
};
