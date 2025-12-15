import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import InfiniteScroll from "react-infinite-scroll-component";
import { ReviewAboutVolunteerCard } from "@/features/Review";

import { GetAboutVolunteerReview, useLazyGetAboutVolunteerReviewsQuery } from "@/entities/Review";

import styles from "./ReviewAboutVolunteer.module.scss";

const ITEMS_PER_PAGE = 20;

export const ReviewAboutVolunteer = () => {
    const { t } = useTranslation("volunteer");
    const [getReviewsData] = useLazyGetAboutVolunteerReviewsQuery();
    const [reviews, setReviews] = useState<GetAboutVolunteerReview[]>([]);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchReviews = async (isInitial: boolean) => {
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
    };

    useEffect(() => {
        fetchReviews(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderCardOffers = (reviewOffers: GetAboutVolunteerReview[]) => reviewOffers.map(
        (review) => <ReviewAboutVolunteerCard data={review} key={review.id} />,
    );

    return (
        <div className={styles.wrapper} id="applications-scroll-wrapper2">
            <h3 className={styles.h3}>{t("volunteer-review.Отзывы о вас")}</h3>
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
