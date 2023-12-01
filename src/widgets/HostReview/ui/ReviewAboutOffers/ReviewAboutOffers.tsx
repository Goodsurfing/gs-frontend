import React, { FC, useState } from "react";

import { fakeReviewData } from "../../model/data/mockedReviewData";
import { ReviewCardOffer } from "@/features/HostReview/";
import { Review } from "@/types/review";
import styles from "./ReviewAboutOffers.module.scss";

export const ReviewAboutOffers: FC = () => {
    const [data] = useState<Review[]>(fakeReviewData);

    const renderCardOffers = (reviewOffers: Review[]) => reviewOffers
        .map((reviewOffer) => (
            <ReviewCardOffer reviewOffer={reviewOffer} />
        ));

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.h3}>Отзывы о ваших проектах</h3>
            <div className={styles.cardContainer}>{renderCardOffers(data)}</div>
        </div>
    );
};
