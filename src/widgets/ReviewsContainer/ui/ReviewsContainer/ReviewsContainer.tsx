import React, { FC, useState } from "react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import ReviewItem from "@/widgets/ReviewsContainer/ui/ReviewItem/ReviewItem";
import { useGetFeaturedReviewsQuery } from "@/entities/Review";
import { getMediaContent } from "@/shared/lib/getMediaContent";

import arrowIcon from "@/shared/assets/images/reviews/arrow.svg";

import styles from "./ReviewsContainer.module.scss";

const ReviewsContainer: FC = () => {
    const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLElement | null>(null);
    const { data: featuredReviews } = useGetFeaturedReviewsQuery();

    // Отзыв без фото на этой витрине смотрится как дыра — фото тут главное.
    const reviewsWithPhotos = (featuredReviews ?? []).filter(
        (review) => review.images.length > 0,
    );

    if (reviewsWithPhotos.length === 0) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.slider}>
                <div className={styles.arrows}>
                    <img
                        ref={(node) => setPrevEl(node)}
                        src={arrowIcon}
                        alt="Prev"
                        loading="lazy"
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
                    modules={[Navigation, Autoplay]}
                    slidesPerView={1}
                    spaceBetween={0}
                    navigation={{
                        prevEl,
                        nextEl,
                        disabledClass: styles.disable,
                    }}
                    effect="fade"
                    autoplay={{
                        delay: 2000,
                        pauseOnMouseEnter: true,
                    }}
                >
                    {reviewsWithPhotos.map((review) => (
                        <SwiperSlide key={review.id}>
                            <ReviewItem
                                title={review.title}
                                text={review.description}
                                image={getMediaContent(review.images[0], "LARGE") ?? ""}
                                author={review.authorName}
                                avatar={getMediaContent(review.authorAvatar ?? undefined, "SMALL")}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ReviewsContainer;
