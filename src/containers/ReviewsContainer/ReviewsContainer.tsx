import React, { FC, useState } from "react";
import { Navigation } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import ReviewItem from "@/containers/ReviewsContainer/ReviewItem/ReviewItem";
import { reviewsData } from "@/containers/ReviewsContainer/Reviews.data";

import arrowIcon from "@/assets/images/reviews/arrow.svg";

import styles from "./ReviewsContainer.module.scss";

const ReviewsContainer: FC = () => {
    const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.wrapper}>
            <div className={styles.slider}>
                <div className={styles.arrows}>
                    <img
                        ref={(node) => setPrevEl(node)}
                        src={arrowIcon}
                        alt="Prev"
                        className={styles.arrow}
                    />
                    <img
                        ref={(node) => setNextEl(node)}
                        src={arrowIcon}
                        alt="Next"
                        className={styles.arrow}
                    />
                </div>
                <Swiper
                    modules={[Navigation]}
                    slidesPerView={1}
                    spaceBetween={0}
                    navigation={{
                        prevEl,
                        nextEl,
                        disabledClass: styles.disable,
                    }}
                    effect={"fade"}
                >
                    {reviewsData &&
                        reviewsData.map((item, index) => (
                            <SwiperSlide key={index}>
                                <ReviewItem {...item} />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ReviewsContainer;
