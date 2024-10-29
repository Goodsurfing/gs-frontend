import React, { FC } from "react";
import cn from "classnames";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import styles from "./ReviewSlider.module.scss";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

export interface ReviewAuthor {
    name: string;
    avatar: string;
}

export interface Review {
    author?: ReviewAuthor;
    text: string;
    title?: string;
    image: string;
}

interface ReviewSliderProps {
    reviews: Review[];
    about: "host" | "volunteer";
    className?: string;
}

export const ReviewSlider: FC<ReviewSliderProps> = (props) => {
    const { reviews, className, about } = props;

    const renderCards = () => reviews.map((review, index) => (
        <SwiperSlide key={index}>
            <div className={styles.card}>
                <div className={styles.left}>
                    <h3 className={styles.title}>{review.title}</h3>
                    <p className={styles.text}>{review.text}</p>
                    <div className={styles.author}>
                        <Avatar size="SMALL" icon={review.author?.avatar} />
                        <span className={styles.name}>{review.author?.name}</span>
                    </div>
                </div>
                <img src={review.image} alt={review.image} className={styles.titleImage} />
            </div>
        </SwiperSlide>
    ));
    return (
        <div className={cn(styles.wrapper, className)}>
            <Swiper
                spaceBetween={30}
                slidesPerView={2}
                modules={[Navigation]}
                navigation
                wrapperClass={styles.swiperWrapper}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                }}
            >
                {renderCards()}
            </Swiper>
        </div>
    );
};
