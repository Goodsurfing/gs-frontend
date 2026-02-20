import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { ArticlesList } from "../ArticlesList/ArticlesList";
import { blogArticleCardAdapter, useLazyGetBlogListQuery } from "@/entities/Blog";
import { OfferPagination } from "@/widgets/OffersMap";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./VolunteerArticlesPage.module.scss";

const limit = 10;

const VolunteerArticlesPage = () => {
    const { t } = useTranslation("volunteer");
    const [getBlogList, { data, isLoading, isFetching }] = useLazyGetBlogListQuery();
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        getBlogList({ page, limit, isAuth: true });
    }, [getBlogList, page]);

    const articles = data?.data ?? [];
    const pagination = data?.pagination;
    const totalPages = pagination ? Math.max(1, Math.ceil(pagination.total / pagination.limit)) : 1;

    return (
        <div className={styles.wrapper}>
            <h2>{t("volunteer-articles.Мои статьи")}</h2>
            {(isLoading || isFetching) ? (
                <MiniLoader />
            ) : (
                <div className={styles.list}>
                    <ArticlesList
                        articles={blogArticleCardAdapter(articles)}
                        className={styles.container}
                    />
                    <OfferPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(p) => setPage(p)}
                        className={styles.pagination}
                    />
                </div>
            )}
        </div>
    );
};

export default VolunteerArticlesPage;
