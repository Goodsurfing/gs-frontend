import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import {
    ArticleHeader, ArticleShare, Navigation,
} from "@/features/Article";
import { getJournalsPageUrl, getNewsPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { CommentWidget } from "@/widgets/Article";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MAIN_URL } from "@/shared/constants/api";
import {
    GetReviewsJournal, journalReviewsAdapter, useCreateReviewJournalMutation,
    useGetJournalByIdQuery, useLazyGetReviewsByJournalIdQuery, usePutLikeJournalMutation,
} from "@/entities/Journal";
import styles from "./JournalPersonal.module.scss";

interface JournalPersonalProps {
    journalId: string;
}

const VISIBLE_COUNT = 10;

const getCalameoEmbedUrl = (url?: string) => {
    if (!url) return null;

    const match = url.match(/calameo\.com\/books\/([a-zA-Z0-9]+)/);
    if (match?.[1]) {
        return `https://v.calameo.com/?bkcode=${match[1]}`;
    }

    if (url.includes("v.calameo.com")) {
        return url;
    }

    return null;
};

export const JournalPersonal: FC<JournalPersonalProps> = (props) => {
    const { journalId } = props;
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [page, setPage] = useState<number>(1);
    const [reviews, setReviews] = useState<GetReviewsJournal[]>([]);

    const { data, isLoading } = useGetJournalByIdQuery(journalId);
    const embedUrl = getCalameoEmbedUrl(data?.description);
    const [putLike] = usePutLikeJournalMutation();
    const [createReview] = useCreateReviewJournalMutation();
    const [getReviews, { data: reviewsData }] = useLazyGetReviewsByJournalIdQuery();

    const fetchReviews = useCallback(async (pageItem: number) => {
        try {
            await getReviews({
                journalId,
                limit: VISIBLE_COUNT,
                page: pageItem,
            }).unwrap();
        } catch {
            setToast({
                text: "Произошла ошибка при подгрузке комментариев",
                type: HintType.Error,
            });
        }
    }, [getReviews, journalId]);

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
            await putLike(journalId).unwrap();
        } catch {
            setToast({
                text: "Произошла ошибка",
                type: HintType.Error,
            });
        }
    };

    const onComment = async (description: string) => {
        try {
            await createReview({ journalId, description }).unwrap();
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
                        { name: "Журналы", link: getJournalsPageUrl(locale) },
                        { name: data.name },
                    ]}
                    className={styles.navigation}
                />
            )}
            <div className={styles.articleWrapper}>
                <ArticleHeader
                    className={styles.articleHeader}
                    title={data?.name ?? ""}
                    date={data?.created ?? ""}
                    likes={data?.likeCount ?? 0}
                    reviews={data?.reviewCount ?? 0}
                    onLike={onLike}
                    locale={locale}
                />
                <div className={styles.content}>
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title={data?.name ?? ""}
                            width="100%"
                            height="500px"
                            allowFullScreen
                            loading="lazy"
                        />
                    ) : (
                        <p>Данный журнал пустой</p>
                    )}
                </div>
                <ArticleShare
                    className={styles.shareBlock}
                    url={`${MAIN_URL}${getNewsPersonalPageUrl(locale, data?.id)}`}
                />
            </div>
            <div className={styles.commentWrapper}>
                <CommentWidget
                    commentsCount={data?.reviewCount ?? 0}
                    onSend={onComment}
                    comments={journalReviewsAdapter(reviews)}
                    onNextComments={handleShowNext}
                    total={reviewsData?.pagination.total}
                    locale={locale}
                />
            </div>
        </div>
    );
};
