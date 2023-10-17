import React, { FC, useState } from "react";

import { fakeRevewData } from "../../model/data/mockedReviewData";
import { ReviewOffer } from "@/features/HostReview/";
import { ReviewCardOffer } from "@/features/HostReview/";
import styles from "./ReviewAboutOffers.module.scss";

export const ReviewAboutOffers: FC = () => {
    const [data] = useState<ReviewOffer[]>(fakeRevewData);

    const renderCardOffers = (reviewOffers: ReviewOffer[]) => reviewOffers
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
