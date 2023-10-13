import React, { FC, useState } from "react";

import { fakeRevewData } from "../../model/slice/data";
import { ReviewOffer } from "../../model/types/reviewAboutOffers";
import { ReviewCardOffer } from "../ReviewCardOffer/ReviewCardOffer";
import styles from "./ReviewAboutOffers.module.scss";

export const ReviewAboutOffers: FC = () => {
    const [data] = useState<ReviewOffer[]>(fakeRevewData);

    const renderCardOffers = (reviewOffers: ReviewOffer[]) =>
        reviewOffers.map((reviewOffer) => (
            <ReviewCardOffer reviewOffer={reviewOffer} />
        ));

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.h3}>Отзывы о ваших проектах</h3>
            <div className={styles.cardContainer}>{renderCardOffers(data)}</div>
        </div>
    );
};
