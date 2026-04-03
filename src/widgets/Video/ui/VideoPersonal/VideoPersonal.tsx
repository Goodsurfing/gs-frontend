import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";
import { ArticleHeader, ArticleShare, Navigation } from "@/features/Article";
import { getVideoPageUrl, getVideoPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import {
    GetReviewsVideo,
    useCreateReviewVideoMutation, useGetVideoByIdQuery,
    useLazyGetReviewsVideoQuery, usePutLikeVideoMutation,
    videoReviewsAdapter,
} from "@/entities/Video";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { useGetFullName } from "@/shared/lib/getFullName";
import { MAIN_URL } from "@/shared/constants/api";
import { CommentWidget } from "@/widgets/Article";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { VideoContent } from "../VideoContent/VideoContent";
import styles from "./VideoPersonal.module.scss";

interface VideoPersonalProps {
    videoId: string;
    locale: Locale;
}

const VISIBLE_COUNT = 10;

export const VideoPersonal: FC<VideoPersonalProps> = (props) => {
    const { videoId, locale } = props;
    const { t } = useTranslation();
    const { isAuth } = useAuth();
    const { getFullName } = useGetFullName();

    const [toast, setToast] = useState<ToastAlert>();
    const [page, setPage] = useState<number>(1);
    const [reviews, setReviews] = useState<GetReviewsVideo[]>([]);

    const { data, isLoading } = useGetVideoByIdQuery({ id: videoId, lang: locale });
    const [putLike] = usePutLikeVideoMutation();
    const [createBlog] = useCreateReviewVideoMutation();
    const [getReviews, { data: reviewsData }] = useLazyGetReviewsVideoQuery();

    const fetchReviews = useCallback(async (pageItem: number) => {
        try {
            await getReviews({
                videoId,
                limit: VISIBLE_COUNT,
                page: pageItem,
            }).unwrap();
        } catch {
            setToast({
                text: "Произошла ошибка при подгрузке комментариев",
                type: HintType.Error,
            });
        }
    }, [getReviews, videoId]);

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
            await putLike(videoId).unwrap();
        } catch {
            setToast({
                text: "Произошла ошибка",
                type: HintType.Error,
            });
        }
    };

    const onComment = async (description: string) => {
        try {
            await createBlog({ videoId, description }).unwrap();
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
                        { name: t("Видео"), link: getVideoPageUrl(locale) },
                        { name: data?.name },
                    ]}
                    className={styles.navigation}
                />
            )}
            <div className={styles.articleWrapper}>
                <ArticleHeader
                    className={styles.articleHeader}
                    title={data?.name ?? ""}
                    authorAvatar={getMediaContent(data?.author.image.thumbnails?.small)}
                    authorName={getFullName(data?.author.firsName, data?.author.lastName)}
                    category={data?.categoryResult.name}
                    categoryColor={data?.categoryResult.color}
                    date={data?.created ?? ""}
                    likes={data?.likeCount ?? 0}
                    reviews={data?.reviewCount ?? 0}
                    locale={locale}
                    onLike={onLike}
                />
                <VideoContent className={styles.content} url={data?.url ?? ""} />
                <ArticleShare
                    className={styles.shareBlock}
                    url={`${MAIN_URL}${getVideoPersonalPageUrl(locale, data?.id)}`}
                />
            </div>
            <div className={styles.commentWrapper}>
                <CommentWidget
                    commentsCount={data?.reviewCount ?? 0}
                    onSend={onComment}
                    comments={videoReviewsAdapter(reviews)}
                    onNextComments={handleShowNext}
                    total={reviewsData?.pagination.total}
                    locale={locale}
                />
            </div>
        </div>
    );
};
