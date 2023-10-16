import React, { FC, useState } from "react";

import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";

import { ReviewFullCard } from "../ReviewFullCard/ReviewFullCard";
import { ReviewMiniCard } from "../ReviewMiniCard/ReviewMiniCard";
import styles from "./ReviewAboutVolunteers.module.scss";
import { fakeData, fakeReviewData } from "../../model/data/mockedUsersData";
import {
    UserCardFullInfo,
    UserCardInfo,
} from "./model/types/reviewAboutVolunteers";

export const ReviewAboutVolunteers: FC = () => {
    const [data] = useState<UserCardInfo[]>(fakeData);

    const [reveiwData] = useState<UserCardFullInfo[]>(fakeReviewData);

    const renderFullCards = (reviews: UserCardFullInfo[]) => reviews
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
                renderItem={(item: UserCardInfo) => (
                    <ReviewMiniCard data={item} />
                )}
            />
            <div className={styles.fullCardContainer}>
                {renderFullCards(reveiwData)}
            </div>
        </div>
    );
};
