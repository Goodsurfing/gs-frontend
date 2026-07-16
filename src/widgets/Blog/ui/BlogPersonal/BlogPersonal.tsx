import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import {
    blogReviewsAdapter,
    GetReviewBlog,
    useCreateReviewBlogMutation, useGetBlogByIdQuery,
    useLazyGetReviewsBlogQuery, usePutLikeBlogMutation,
} from "@/entities/Blog";
import {
    ArticleContent, ArticleHeader, ArticleShare, Navigation,
} from "@/features/Article";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { CommentWidget } from "@/widgets/Article";
import {
    getBlogPageUrl,
    getBlogPersonalPageUrl,
} from "@/shared/config/routes/AppUrls";
import { MAIN_URL } from "@/shared/constants/api";
import { useGetFullName } from "@/shared/lib/getFullName";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getSeoDescription, getSeoUrl } from "@/shared/lib/getSeoUrl";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import styles from "./BlogPersonal.module.scss";

interface BlogPersonalProps {
    blogIdOrSlug: string;
}

const VISIBLE_COUNT = 10;

export const BlogPersonal: FC<BlogPersonalProps> = (props) => {
    const { blogIdOrSlug } = props;
    const { locale } = useLocale();
    const { isAuth } = useAuth();
    const { t, ready } = useTranslation("blog");
    const [toast, setToast] = useState<ToastAlert>();
    const [page, setPage] = useState<number>(1);
    const [reviews, setReviews] = useState<GetReviewBlog[]>([]);
    const { getFullName } = useGetFullName();

    const { data, isLoading } = useGetBlogByIdQuery({ id: blogIdOrSlug, lang: locale });
    const articleContent = data?.description ?? "<p>Данная статья пустая</p>";
    const [putLike] = usePutLikeBlogMutation();
    const [createBlog] = useCreateReviewBlogMutation();
    const [getReviews, { data: reviewsData }] = useLazyGetReviewsBlogQuery();

    // Реальный числовой id статьи, а не blogIdOrSlug (это может быть slug из
    // URL) — лайки/комментарии/отклики на бэкенде завязаны на настоящий id.
    const blogId = data?.id;

    const fetchReviews = useCallback(async (pageItem: number) => {
        if (blogId === undefined) {
            return;
        }
        try {
            await getReviews({
                blogId,
                limit: VISIBLE_COUNT,
                page: pageItem,
            }).unwrap();
        } catch {
            setToast({
                text: "Произошла ошибка при подгрузке комментариев",
                type: HintType.Error,
            });
        }
    }, [getReviews, blogId]);

    useEffect(() => {
        fetchReviews(page);
    }, [fetchReviews, page]);

    useEffect(() => {
        if (reviewsData?.data) {
            setReviews((prev) => {
                if (page === 1) {
                    return [...reviewsData.data];
                }
                return [...prev, ...reviewsData.data];
            });
        }
    }, [reviewsData, page]);

    const onLike = async () => {
        if (!isAuth) {
            setToast({
                text: "Чтобы поставить лайк, нужно авторизоваться",
                type: HintType.Error,
            });
            return;
        }
        if (blogId === undefined) {
            return;
        }
        try {
            setToast(undefined);
            await putLike(blogId).unwrap();
        } catch {
            setToast({
                text: "Произошла ошибка",
                type: HintType.Error,
            });
        }
    };

    const onComment = async (description: string) => {
        if (blogId === undefined) {
            return;
        }
        try {
            await createBlog({ blogId, description }).unwrap();
            await fetchReviews(1);
        } catch {
            setToast({
                text: "Произошла ошибка",
                type: HintType.Error,
            });
        }
    };

    const handleShowNext = () => {
        setPage((prev) => prev + 1);
    };

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    const seoTitle = data?.name || t("seo.title");
    const seoDescription = data?.description
        ? getSeoDescription(data.description) || t("seo.description")
        : t("seo.description");
    // data?.slug, а не blogIdOrSlug (сырой параметр из URL) — иначе переход
    // по старой ссылке с голым числовым id даёт canonical на ту же
    // нечитаемую ссылку, а не на новый человекопонятный slug (row 117).
    const seoUrl = getSeoUrl(getBlogPersonalPageUrl(locale, data?.slug ?? blogIdOrSlug));
    const seoImage = getMediaContent(data?.image?.contentUrl);

    return (
        <div className={styles.wrapper}>
            {ready && (
                <SeoHelmet
                    title={seoTitle}
                    description={seoDescription}
                    canonicalUrl={seoUrl}
                    ogImage={seoImage}
                />
            )}
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            {data && (
                <Navigation
                    breadcrumbs={[
                        { name: "Блог", link: getBlogPageUrl(locale) },
                        { name: data.name },
                    ]}
                    className={styles.navigation}
                />
            )}
            <div className={styles.articleWrapper}>
                <ArticleHeader
                    className={styles.articleHeader}
                    title={data?.name ?? ""}
                    authorId={data?.author?.id}
                    authorAvatar={getMediaContent(data?.author?.image?.thumbnails?.small)}
                    authorName={getFullName(data?.author?.firstName, data?.author?.lastName)}
                    categories={data?.blogCategoryResults}
                    date={data?.created ?? ""}
                    likes={data?.likeCount ?? 0}
                    reviews={data?.reviewCount ?? 0}
                    onLike={onLike}
                    locale={locale}
                />
                <ArticleContent className={styles.content} content={articleContent} />
                <ArticleShare
                    className={styles.shareBlock}
                    url={`${MAIN_URL}${getBlogPersonalPageUrl(locale, data?.slug ?? String(data?.id))}`}
                />
            </div>
            <div className={styles.commentWrapper}>
                <CommentWidget
                    commentsCount={data?.reviewCount ?? 0}
                    onSend={onComment}
                    comments={blogReviewsAdapter(reviews)}
                    onNextComments={handleShowNext}
                    total={reviewsData?.pagination.total}
                    locale={locale}
                />
            </div>
        </div>
    );
};
