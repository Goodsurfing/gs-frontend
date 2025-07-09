import React, { FC, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReviewCardOffer } from "@/features/Review/";
import styles from "./ReviewAboutOffers.module.scss";
import { ApplicationReviewResponse, useLazyGetToOrganizationsReviewsByIdQuery } from "@/entities/Review";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

interface ReviewAboutOffersProps {
    hostId: string;
    locale: Locale;
}

const ITEMS_PER_PAGE = 20;

export const ReviewAboutOffers: FC<ReviewAboutOffersProps> = (props) => {
    const { hostId, locale } = props;
    const { t } = useTranslation("host");
    const [getReviewsData] = useLazyGetToOrganizationsReviewsByIdQuery();
    const [reviews, setReviews] = useState<ApplicationReviewResponse[]>([]);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchReviews = async (isInitial: boolean) => {
        try {
            const currentPage = isInitial ? 1 : page;

            const result = await getReviewsData({
                hostId,
                page: currentPage,
                itemsPerPage: ITEMS_PER_PAGE,
            }).unwrap();

            if (result.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }

            if (isInitial) {
                setReviews(result);
                setPage(2);
            } else {
                setReviews((prev) => [...prev, ...result]);
                setPage((prevPage) => prevPage + 1);
            }
        } catch { /* empty */ }
    };

    useEffect(() => {
        fetchReviews(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderCardOffers = (reviewOffers: ApplicationReviewResponse[]) => reviewOffers
        .map((reviewOffer) => (
            <ReviewCardOffer reviewOffer={reviewOffer} key={reviewOffer.id} locale={locale} />
        ));

    return (
        <div className={styles.wrapper} id="applications-scroll-wrapper">
            <h3 className={styles.h3}>{t("hostReviews.Отзывы о проектах")}</h3>
            <div className={styles.cardContainer}>
                <InfiniteScroll
                    dataLength={reviews.length}
                    next={() => fetchReviews(false)}
                    hasMore={hasMore}
                    scrollThreshold="70%"
                    loader={null}
                    scrollableTarget="applications-scroll-wrapper"
                >
                    {renderCardOffers(reviews)}
                </InfiniteScroll>
            </div>
        </div>
    );
};
