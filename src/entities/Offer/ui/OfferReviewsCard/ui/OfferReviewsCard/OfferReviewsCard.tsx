import React, { FC, memo, useMemo } from "react";

import { Link } from "react-router-dom";
import { OfferReview } from "@/entities/Offer/model/types/offerReview";

import { OfferReviewCard } from "../OfferReviewCard/OfferReviewCard";
import styles from "./OfferReviewsCard.module.scss";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface OfferReviewsCardProps {
    reviews: OfferReview[];
}

export const OfferReviewsCard: FC<OfferReviewsCardProps> = memo((
    props: OfferReviewsCardProps,
) => {
    const { reviews } = props;
    const { locale } = useLocale();

    const renderCards = useMemo(() => reviews
        .slice(0, 3)
        .map((review, index) => (
            <OfferReviewCard review={review} key={index} />
        )), [reviews]);

    return (
        <div className={styles.wrapper}>
            <h3>Отзывы</h3>
            <div className={styles.container}>{renderCards}</div>
            <Link className={styles.viewAll} to={getMainPageUrl(locale)}>Посмотреть все</Link>
        </div>
    );
});
