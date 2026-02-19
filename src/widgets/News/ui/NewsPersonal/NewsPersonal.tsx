import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import {
    ArticleContent, ArticleHeader, ArticleShare, Navigation,
} from "@/features/Article";
import { getNewsPageUrl, getNewsPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import {
    GetReviewsNews,
    newsReviewsAdapter,
    useCreateReviewNewsMutation, useGetNewsByIdQuery,
    useLazyGetReviewsNewsQuery, usePutLikeNewsMutation,
} from "@/entities/News";
import defaultImage from "@/shared/assets/images/personalCardMOCK.png";
import { CommentWidget } from "@/widgets/Article";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MAIN_URL } from "@/shared/constants/api";
import styles from "./NewsPersonal.module.scss";

interface NewsPersonalProps {
    newsId: string;
}

const VISIBLE_COUNT = 10;

export const NewsPersonal: FC<NewsPersonalProps> = (props) => {
    const { newsId } = props;
    const { locale } = useLocale();
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
        setToast(undefined);
        try {
            await putLike(newsId).unwrap();
        } catch {
            setToast({
                text: "Произошла ошибка",
                type: HintType.Error,
            });
        }
    };

    const onComment = async (description: string) => {
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

    return (
        <div className={styles.wrapper}>
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
                    authorAvatar={defaultImage}
                    authorName="Алексей Петров"
                    category={data?.category.name}
                    categoryColor={data?.category.color}
                    date={data?.created ?? ""}
                    likes={data?.likeCount ?? 0}
                    reviews={data?.reviewCount ?? 0}
                    onLike={onLike}
                />
                <ArticleContent className={styles.content} content={articleContent} />
                <ArticleShare
                    className={styles.shareBlock}
                    url={`${MAIN_URL}${getNewsPersonalPageUrl(locale, data?.id)}`}
                />
            </div>
            <div className={styles.commentWrapper}>
                <CommentWidget
                    commentsCount={data?.reviewCount ?? 0}
                    onSend={onComment}
                    comments={newsReviewsAdapter(reviews)}
                    onNextComments={handleShowNext}
                    total={reviewsData?.pagination.total}
                />
            </div>
        </div>
    );
};
