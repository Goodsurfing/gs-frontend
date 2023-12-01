import React, { FC, useState } from "react";

import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";

import { ReviewFullCard, ReviewMiniCard } from "@/features/HostReview/";

import { fakeData, fakeReviewData } from "../../model/data/mockedUsersData";
import styles from "./ReviewAboutVolunteers.module.scss";
import { ReviewCardFullInfo, ReviewCardInfo } from "@/types/review";

export const ReviewAboutVolunteer: FC = () => {
    const [data] = useState<ReviewCardInfo[]>(fakeData);

    const [reveiwData] = useState<ReviewCardFullInfo[]>(fakeReviewData);

    const renderFullCards = (reviews: ReviewCardFullInfo[]) => reviews
        .map((review) => <ReviewFullCard review={review} />);

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.h3}>Отзывы про волонтёров</h3>
            <p className={styles.description}>
                Волонтёры, которых вы недавно принимали
            </p>
            <VerticalSlider
                classNameSlide={styles.swiperSlide}
                classNameWrapper={styles.swiperWrapper}
                className={styles.slider}
                data={data}
                renderItem={(item: ReviewCardInfo) => (
                    <ReviewMiniCard data={item} />
                )}
            />
            <div className={styles.fullCardContainer}>
                {renderFullCards(reveiwData)}
            </div>
        </div>
    );
};
