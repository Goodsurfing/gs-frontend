import React, { FC, useState } from "react";

import { fakeReviewData } from "../../model/data/mockedReviewData";
import { ReviewCardOffer } from "@/features/Review/";
import { ReviewCardInfo } from "@/types/review";
import styles from "./ReviewAboutOffers.module.scss";

export const ReviewAboutOffers: FC = () => {
    const [data] = useState<ReviewCardInfo[]>(fakeReviewData);

    const renderCardOffers = (reviewOffers: ReviewCardInfo[]) => reviewOffers
        .map((reviewOffer, index) => (
            <ReviewCardOffer reviewOffer={reviewOffer} key={index} />
        ));

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.h3}>Отзывы о проектах</h3>
            <div className={styles.cardContainer}>{renderCardOffers(data)}</div>
        </div>
    );
};
