import React, { FC, useEffect, useState } from "react";

import { ReviewCardOffer } from "@/features/Review/";
import styles from "./ReviewAboutOffers.module.scss";
import { ApplicationReviewResponse, useLazyGetToOrganizationsReviewsByIdQuery } from "@/entities/Review";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

interface ReviewAboutOffersProps {
    hostId: string;
    locale: Locale;
}

export const ReviewAboutOffers: FC<ReviewAboutOffersProps> = (props) => {
    const { hostId, locale } = props;
    const [getReviewsData, { data }] = useLazyGetToOrganizationsReviewsByIdQuery();
    const [reviews, setReviews] = useState<ApplicationReviewResponse[]>([]);

    useEffect(() => {
        getReviewsData(hostId);
    }, [getReviewsData, hostId]);

    useEffect(() => {
        if (data) {
            setReviews([...data]);
        } else {
            setReviews([]);
        }
    }, [data]);

    const renderCardOffers = (reviewOffers: ApplicationReviewResponse[]) => reviewOffers
        .map((reviewOffer) => (
            <ReviewCardOffer reviewOffer={reviewOffer} key={reviewOffer.id} locale={locale} />
        ));

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.h3}>Отзывы о проектах</h3>
            <div className={styles.cardContainer}>{renderCardOffers(reviews)}</div>
        </div>
    );
};
