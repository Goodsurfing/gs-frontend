import React from "react";
import styles from "./ReviewAboutGoodsurfers.module.scss";
import { ReviewSlider, Review } from "@/widgets/Review";

export const ReviewAboutGoodsurfers = () => {
    const mockedReview: Review = [{image:}];
    return (
        <div className={styles.wrapper}>
            <ReviewSlider about="volunteer" reviews={mockedReview} />
        </div>
    );
};
