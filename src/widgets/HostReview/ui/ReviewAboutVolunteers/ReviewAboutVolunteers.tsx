import React, { FC } from "react";

import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";

import { ReviewFullCard, ReviewMiniCard } from "@/features/HostReview/";

import { fakeUserData } from "../../model/data/mockedUsersData";
import styles from "./ReviewAboutVolunteers.module.scss";
import { ReviewCardInfo } from "@/types/review";

export const ReviewAboutVolunteers: FC = () => {
    const renderFullCards = (reviews: ReviewCardInfo[]) => reviews
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
                data={fakeUserData}
                renderItem={(item: ReviewCardInfo) => (
                    <ReviewMiniCard data={item} />
                )}
            />
            <div className={styles.fullCardContainer}>
                {renderFullCards(fakeUserData)}
            </div>
        </div>
    );
};
