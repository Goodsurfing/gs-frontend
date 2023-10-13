import React, { FC, useState } from "react";

import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";

import { ReviewFullCard } from "../ReviewFullCard/ReviewFullCard";
import { ReviewMiniCard } from "../ReviewMiniCard/ReviewMiniCard";
import styles from "./ReviewAboutVolunteers.module.scss";
import { fakeData, fakeReviewData } from "./model/slice/data";
import {
    userCardFullInfo,
    userCardInfo,
} from "./model/types/reviewAboutVolunteers";

export const ReviewAboutVolunteers: FC = () => {
    const [data] = useState<userCardInfo[]>(fakeData);

    const [reveiwData] = useState<userCardFullInfo[]>(fakeReviewData);

    const renderFullCards = (reviews: userCardFullInfo[]) =>
        reviews.map((review) => <ReviewFullCard review={review} />);

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
                renderItem={(item: userCardInfo) => (
                    <ReviewMiniCard data={item} />
                )}
            />
            <div className={styles.fullCardContainer}>
                {renderFullCards(reveiwData)}
            </div>
        </div>
    );
};
