import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import {
    GetReviewsNews,
    newsReviewsAdapter,
    useCreateReviewNewsMutation, useGetNewsByIdQuery,
    useLazyGetReviewsNewsQuery, usePutLikeNewsMutation,
} from "@/entities/News";
import {
    ArticleContent, ArticleHeader, ArticleShare, Navigation,
} from "@/features/Article";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { CommentWidget } from "@/widgets/Article";
import { getNewsPageUrl, getNewsPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { MAIN_URL } from "@/shared/constants/api";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getSeoDescription, getSeoUrl } from "@/shared/lib/getSeoUrl";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import styles from "./NewsPersonal.module.scss";

interface NewsPersonalProps {
    newsId: string;
}

const VISIBLE_COUNT = 10;

export const NewsPersonal: FC<NewsPersonalProps> = (props) => {
    const { newsId } = props;
    const { locale } = useLocale();
    const { isAuth } = useAuth();
    const { t, ready } = useTranslation("news");
    const [toast, setToast] = useState<ToastAlert>();
    const [page, setPage] = useState<number>(1);
    const [reviews, setReviews] = useState<GetReviewsNews[]>([]);

    const { data, isLoading } = useGetNewsByIdQuery({ id: newsId, lang: locale });
    const articleContent = data?.description ?? "<p>Данная статья пустая</p>";
    const [putLike] = usePutLikeNewsMutation();
    const [createNews] = useCreateReviewNewsMutation();
    const [getReviews, { data: reviewsData }] = useLazyGetReviewsNewsQuery();

    const fetchReviews = useCallback(async (pageItem: number) => {
        try {
            await getReviews({
                newsId,
                limit: VISIBLE_COUNT,
                page: pageItem,
            }).unwrap();
        } catch {
            setToast({
                text: "Произошла ошибка при подгрузке комментариев",
                type: HintType.Error,
            });
        }
    }, [getReviews, newsId]);

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
        try {
            setToast(undefined);
            await putLike(newsId).unwrap();
        } catch {
            setToast({
                text: "Произошла ошибка",
                type: HintType.Error,
            });
        }
    };

    const onComment = async (description: string) => {
        if (!isAuth) {
            setToast({
                text: "Чтобы оставить комментарий, нужно авторизоваться",
                type: HintType.Error,
            });
            return;
        }
        try {
            await createNews({ newsId, description }).unwrap();
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
    // data?.slug, а не newsId (сырой параметр из URL) — иначе переход по
    // старой ссылке с голым UUID даёт canonical на ту же нечитаемую ссылку,
    // а не на новый человекопонятный slug (весь смысл ЧПУ, row 117).
    const seoUrl = getSeoUrl(getNewsPersonalPageUrl(locale, data?.slug ?? newsId));
    // og:image: краулерам нужен оригинал
    // eslint-disable-next-line no-restricted-syntax
    const seoImage = getMediaContent(data?.image?.contentUrl);
    const seoKeywords = [
        data?.name,
        data?.category.name,
        t("seo.keywords"),
    ].filter(Boolean).join(", ");

    return (
        <div className={styles.wrapper}>
            {ready && (
                <SeoHelmet
                    title={seoTitle}
                    description={seoDescription}
                    canonicalUrl={seoUrl}
                    keywords={seoKeywords}
                    ogImage={seoImage}
                />
            )}
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            {data && (
                <Navigation
                    breadcrumbs={[
                        { name: "Новости", link: getNewsPageUrl(locale) },
                        { name: data.name },
                    ]}
                    className={styles.navigation}
                />
            )}
            <div className={styles.articleWrapper}>
                <ArticleHeader
                    className={styles.articleHeader}
                    title={data?.name ?? ""}
                    category={data?.category.name}
                    categoryColor={data?.category.color}
                    date={data?.created ?? ""}
                    likes={data?.likeCount ?? 0}
                    reviews={data?.reviewCount ?? 0}
                    onLike={onLike}
                    locale={locale}
                />
                <ArticleContent className={styles.content} content={articleContent} />
                <ArticleShare
                    className={styles.shareBlock}
                    url={`${MAIN_URL}${getNewsPersonalPageUrl(locale, data?.slug)}`}
                />
            </div>
            <div className={styles.commentWrapper}>
                <CommentWidget
                    commentsCount={data?.reviewCount ?? 0}
                    onSend={onComment}
                    comments={newsReviewsAdapter(reviews)}
                    onNextComments={handleShowNext}
                    total={reviewsData?.pagination.total}
                    locale={locale}
                />
            </div>
        </div>
    );
};
