import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import {
    GetReviewsJournal, journalReviewsAdapter, useCreateReviewJournalMutation,
    useGetJournalByIdQuery, useLazyGetReviewsByJournalIdQuery, usePutLikeJournalMutation,
} from "@/entities/Journal";
import {
    ArticleContent,
    ArticleHeader, ArticleShare, Navigation,
} from "@/features/Article";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { CommentWidget } from "@/widgets/Article";
import { getJournalPersonalPageUrl, getJournalsPageUrl } from "@/shared/config/routes/AppUrls";
import { MAIN_URL } from "@/shared/constants/api";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getSeoDescription, getSeoUrl } from "@/shared/lib/getSeoUrl";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import styles from "./JournalPersonal.module.scss";

interface JournalPersonalProps {
    journalIdOrSlug: string;
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
    const { journalIdOrSlug } = props;
    const { locale } = useLocale();
    const { isAuth } = useAuth();
    const { t, ready } = useTranslation("journals");
    const [toast, setToast] = useState<ToastAlert>();
    const [page, setPage] = useState<number>(1);
    const [reviews, setReviews] = useState<GetReviewsJournal[]>([]);

    const { data, isLoading } = useGetJournalByIdQuery(journalIdOrSlug);
    const articleContent = data?.description ?? "<p>Данная статья пустая</p>";
    const embedUrl = getCalameoEmbedUrl(data?.url);
    const [putLike] = usePutLikeJournalMutation();
    const [createReview] = useCreateReviewJournalMutation();
    const [getReviews, { data: reviewsData }] = useLazyGetReviewsByJournalIdQuery();

    // Реальный id, а не journalIdOrSlug (может быть slug из URL) — лайки/
    // комментарии на бэкенде завязаны на настоящий id (row 117).
    const journalId = data?.id;

    const fetchReviews = useCallback(async (pageItem: number) => {
        if (journalId === undefined) {
            return;
        }
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
        if (!isAuth) {
            setToast({
                text: "Чтобы поставить лайк, нужно авторизоваться",
                type: HintType.Error,
            });
            return;
        }
        if (journalId === undefined) {
            return;
        }
        try {
            setToast(undefined);
            await putLike(journalId).unwrap();
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
        if (journalId === undefined) {
            return;
        }
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

    const seoTitle = data?.name || t("seo.title");
    const seoDescription = data?.description
        ? getSeoDescription(data.description) || t("seo.description")
        : t("seo.description");
    // data?.slug, а не journalIdOrSlug (сырой параметр из URL) — иначе переход
    // по старой ссылке с голым UUID даёт canonical на ту же нечитаемую
    // ссылку, а не на новый человекопонятный slug (row 117).
    const seoUrl = getSeoUrl(getJournalPersonalPageUrl(locale, data?.slug ?? journalIdOrSlug));
    const seoImage = getMediaContent(data?.image?.contentUrl);
    const seoKeywords = [
        data?.name,
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
                    <ArticleContent className={styles.articleContent} content={articleContent} />
                    {embedUrl && (
                        <iframe
                            src={embedUrl}
                            title={data?.name ?? ""}
                            width="100%"
                            height="500px"
                            allowFullScreen
                            loading="lazy"
                        />
                    )}
                </div>
                <ArticleShare
                    className={styles.shareBlock}
                    url={`${MAIN_URL}${getJournalPersonalPageUrl(locale, data?.slug ?? data?.id)}`}
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
