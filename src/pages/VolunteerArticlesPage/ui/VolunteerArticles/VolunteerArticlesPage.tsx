import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { ArticlesList } from "../ArticlesList/ArticlesList";
import {
    blogArticleCardAdapter, useDeleteBlogMutation,
    useLazyGetBlogListQuery, usePublicBlogByIdMutation,
} from "@/entities/Blog";
import { OfferPagination } from "@/widgets/OffersMap";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getVolunteerCreateArticlePageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./VolunteerArticlesPage.module.scss";

const limit = 10;

const VolunteerArticlesPage = () => {
    const { t } = useTranslation("volunteer");
    const { locale } = useLocale();

    const [getBlogList, {
        data: blogData,
        isLoading: isLoadingBlog, isFetching: isFetchingBlog,
    }] = useLazyGetBlogListQuery();
    const [getBlogDraftList, {
        data: blogDraftData,
        isLoading: isLoadingBlogDraft, isFetching: isFetchingBlogDraft,
    }] = useLazyGetBlogListQuery();

    const [deleteBlog] = useDeleteBlogMutation();
    const [publicBlog] = usePublicBlogByIdMutation();
    const [page, setPage] = useState<number>(1);
    const [pageDraft, setPageDraft] = useState<number>(1);
    const [toast, setToast] = useState<ToastAlert>();

    useEffect(() => {
        getBlogList({
            page, limit, isAuth: true, isActive: true,
        });
    }, [getBlogList, page]);

    useEffect(() => {
        getBlogDraftList({
            page: pageDraft, limit, isAuth: true, isActive: false,
        });
    }, [getBlogDraftList, pageDraft]);

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

    const handlePublicArticle = async (id: string) => {
        try {
            await publicBlog({ id: Number(id), body: { isActive: true } }).unwrap();
            setToast({
                text: t("volunteer-articles.Статья опубликована"),
                type: HintType.Success,
            });
        } catch (error) {
            setToast({
                text: t("volunteer-articles.Ошибка публикации статьи"),
                type: HintType.Error,
            });
        }
    };

    const articles = blogData?.data ?? [];
    const articlesDraft = blogDraftData?.data ?? [];
    const pagination = blogData?.pagination;
    const paginationDraft = blogDraftData?.pagination;
    const totalPages = pagination ? Math.max(1, Math.ceil(pagination.total / pagination.limit)) : 1;
    const totalPagesDraft = paginationDraft
        ? Math.max(1, Math.ceil(paginationDraft.total / paginationDraft.limit)) : 1;

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h2>{t("volunteer-articles.Мои статьи")}</h2>
            {(pagination?.total === 0) && (
                <div className={styles.empty}>
                    <p>{t("volunteer-articles.На данный момент у вас нет добавленных статей. Создайте свою первую статью")}</p>
                    <ButtonLink
                        path={getVolunteerCreateArticlePageUrl(locale)}
                        type="primary"
                    >
                        {t("volunteer-articles.Создать статью")}
                    </ButtonLink>
                </div>
            )}
            {(isLoadingBlog || isFetchingBlog) ? (
                <MiniLoader />
            ) : (
                <div className={styles.list}>
                    <ArticlesList
                        articles={blogArticleCardAdapter(articles)}
                        className={styles.container}
                        onDelete={handleDeleteArticle}
                        onPublic={handlePublicArticle}
                    />
                    {(pagination?.total !== 0) && (
                        <OfferPagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(p) => setPage(p)}
                            className={styles.pagination}
                        />
                    )}

                </div>
            )}
            {(isLoadingBlogDraft || isFetchingBlogDraft) ? (
                <MiniLoader />
            ) : (
                (paginationDraft?.total !== 0) && (
                    <div className={styles.draftWrapper}>
                        <h2>{t("volunteer-articles.Черновики")}</h2>
                        <div className={styles.list}>
                            <ArticlesList
                                articles={blogArticleCardAdapter(articlesDraft)}
                                className={styles.container}
                                onDelete={handleDeleteArticle}
                                onPublic={handlePublicArticle}
                            />
                            <OfferPagination
                                currentPage={pageDraft}
                                totalPages={totalPagesDraft}
                                onPageChange={(p) => setPageDraft(p)}
                                className={styles.pagination}
                            />
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default VolunteerArticlesPage;
