import React, { FC } from "react";
import { ReviewCardInfo } from "@/types/review";

import { ReviewFullCard, ReviewMiniCard } from "@/features/HostReview/";

import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";

import { mockedReviewOfferData } from "../../model/data/mockedReviewData";
import styles from "./ReviewAboutOffers.module.scss";

export const ReviewAboutOffers: FC = () => {
    const renderFullCards = (reviews: ReviewCardInfo[]) => reviews.map(
        (review) => <ReviewFullCard review={review} />,
    );

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.h3}>Отзывы о проектах</h3>
            <p className={styles.description}>
                Проекты, которые вы недавно посещали
            </p>
            <VerticalSlider
                classNameSlide={styles.swiperSlide}
                classNameWrapper={styles.swiperWrapper}
                className={styles.slider}
                data={mockedReviewOfferData}
                renderItem={(item: ReviewCardInfo) => (
                    <ReviewMiniCard data={item} />
                )}
            />
            <div className={styles.fullCardContainer}>
                {renderFullCards(mockedReviewOfferData)}
            </div>
        </div>
    );
};
