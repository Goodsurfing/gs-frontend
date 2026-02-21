import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { ArticlesList } from "../ArticlesList/ArticlesList";
import { blogArticleCardAdapter, useDeleteBlogMutation, useLazyGetBlogListQuery } from "@/entities/Blog";
import { OfferPagination } from "@/widgets/OffersMap";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./VolunteerArticlesPage.module.scss";

const limit = 10;

const VolunteerArticlesPage = () => {
    const { t } = useTranslation("volunteer");
    const [getBlogList, { data, isLoading, isFetching }] = useLazyGetBlogListQuery();
    const [deleteBlog] = useDeleteBlogMutation();
    const [page, setPage] = useState<number>(1);
    const [toast, setToast] = useState<ToastAlert>();

    useEffect(() => {
        getBlogList({ page, limit, isAuth: true });
    }, [getBlogList, page]);

    const handleDeleteArticle = async (id: string) => {
        try {
            await deleteBlog(Number(id)).unwrap();
            setToast({
                text: t("volunteer-articles.Статья удалена"),
                type: HintType.Success,
            });
        } catch (error) {
            setToast({
                text: t("volunteer-articles.Ошибка удаления статьи"),
                type: HintType.Error,
            });
        }
    };

    const articles = data?.data ?? [];
    const pagination = data?.pagination;
    const totalPages = pagination ? Math.max(1, Math.ceil(pagination.total / pagination.limit)) : 1;

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h2>{t("volunteer-articles.Мои статьи")}</h2>
            {(isLoading || isFetching) ? (
                <MiniLoader />
            ) : (
                <div className={styles.list}>
                    <ArticlesList
                        articles={blogArticleCardAdapter(articles)}
                        className={styles.container}
                        onDelete={handleDeleteArticle}
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
