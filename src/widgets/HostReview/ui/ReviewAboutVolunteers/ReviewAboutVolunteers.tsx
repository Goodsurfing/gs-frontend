import React, { FC } from "react";

import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";

import { ReviewFullCard, ReviewMiniCard } from "@/features/Review";

import { fakeUserData } from "../../model/data/mockedUsersData";
import { Review } from "@/types/review";
import styles from "./ReviewAboutVolunteers.module.scss";

export const ReviewAboutVolunteers: FC = () => {
    const renderFullCards = (reviews: Review[]) => reviews
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
                renderItem={(item: Review) => (
                    <ReviewMiniCard data={item} />
                )}
            />
            <div className={styles.fullCardContainer}>
                {renderFullCards(fakeUserData)}
            </div>
        </div>
    );
};
