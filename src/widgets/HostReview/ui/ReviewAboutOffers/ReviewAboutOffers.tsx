import React, {
    FC, useCallback, useEffect, useState,
} from "react";

import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReviewCardOffer } from "@/features/Review";
import {
    GetOfferReview,
    useLazyGetOfferReviewsQuery,
} from "@/entities/Review";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import styles from "./ReviewAboutOffers.module.scss";

const ITEMS_PER_PAGE = 20;

interface ReviewAboutOffersProps {
    locale: Locale;
}

export const ReviewAboutOffers: FC<ReviewAboutOffersProps> = (props) => {
    const { locale } = props;
    const { t } = useTranslation("host");
    const [getReviewsData] = useLazyGetOfferReviewsQuery();
    const [reviews, setReviews] = useState<GetOfferReview[]>([]);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchReviews = useCallback(async (isInitial: boolean) => {
        try {
            const currentPage = isInitial ? 1 : page;

            const result = await getReviewsData({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            }).unwrap();

            if (result.data.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }

            if (isInitial) {
                setReviews(result.data);
                setPage(2);
            } else {
                setReviews((prev) => [...prev, ...result.data]);
                setPage((prevPage) => prevPage + 1);
            }
        } catch { /* empty */ }
    }, [getReviewsData, page]);

    useEffect(() => {
        fetchReviews(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderCardOffers = (reviewOffers: GetOfferReview[]) => reviewOffers
        .map((reviewOffer) => (
            <ReviewCardOffer reviewOffer={reviewOffer} key={reviewOffer.id} locale={locale} />
        ));

    return (
        <div className={styles.wrapper} id="applications-scroll-wrapper2">
            <h3 className={styles.h3}>{t("hostReviews.Отзывы о проектах")}</h3>
            <div className={styles.cardContainer}>
                <InfiniteScroll
                    dataLength={reviews.length}
                    next={() => fetchReviews(false)}
                    hasMore={hasMore}
                    scrollThreshold="70%"
                    loader={null}
                    scrollableTarget="applications-scroll-wrapper2"
                >
                    {renderCardOffers(reviews)}
                </InfiniteScroll>
            </div>
        </div>
    );
};
