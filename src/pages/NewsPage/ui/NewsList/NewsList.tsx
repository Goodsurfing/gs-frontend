import React, { FC, useMemo } from "react";
import cn from "classnames";
import styles from "./NewsList.module.scss";
import { ArticleCard } from "@/entities/Article/";
import { getNewsPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { GetNewsList } from "@/entities/News";

interface NewsListProps {
    data?: GetNewsList[]
    className?: string;
}

export const NewsList: FC<NewsListProps> = (props) => {
    const { data, className } = props;
    const { locale } = useLocale();

    const renderNews = useMemo(() => data?.map((article) => (
        <ArticleCard
            article={article}
            key={article.id}
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
