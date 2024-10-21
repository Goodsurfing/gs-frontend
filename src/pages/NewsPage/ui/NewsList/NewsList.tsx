import React, { FC, useMemo } from "react";
import cn from "classnames";
import { Article } from "@/entities/Article";
import styles from "./NewsList.module.scss";
import { ArticleCard } from "@/entities/Article/";
import { getNewsPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface NewsListProps {
    data?: Article[]
    className?: string;
}

export const NewsList: FC<NewsListProps> = (props) => {
    const { data, className } = props;
    const { locale } = useLocale();

    const renderNews = useMemo(() => data?.map((article, key) => (
        <ArticleCard
            article={article}
            key={key}
            className={styles.article}
            path={getNewsPersonalPageUrl(locale, article.id.toString())}
        />
    )), [data, locale]);

    if (!data) {
        return (
            <div>Новостей не было найдено</div>
        );
    }

    return (
        <div className={cn(className, styles.wrapper)}>{renderNews}</div>
    );
};
