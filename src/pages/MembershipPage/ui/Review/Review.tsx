import cn from "classnames";
import React, { FC, useMemo } from "react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";

import { useTranslation } from "react-i18next";
import { reviewsData } from "@/containers/ReviewsContainer/Reviews.data";
import { ReviewSlide } from "../ReviewSlide/ReviewSlide";
import styles from "./Review.module.scss";

interface ReviewProps {
    className?: string;
}

export const Review: FC<ReviewProps> = (props: ReviewProps) => {
    const { className } = props;
    const { t } = useTranslation("membership");
    const renderSlides = useMemo(
        () => reviewsData.map((review, index) => (
            <SwiperSlide key={index}>
                <ReviewSlide
                    className={styles.slide}
                    title={review.title}
                    reviewText={review.text}
                    image={review.image}
                    authorName={review.author}
                    authorAvatar={review.avatar}
                />
            </SwiperSlide>
        )),
        [],
    );

    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("review.Отзывы")}</h2>
            <Swiper
                className={styles.swiper}
                modules={[Navigation]}
                centeredSlides
                spaceBetween={50}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                speed={1000}
            >
                {renderSlides}
            </Swiper>
        </section>
    );
};
