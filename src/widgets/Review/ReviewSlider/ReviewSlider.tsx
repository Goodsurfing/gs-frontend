import cn from "classnames";
import React, { FC } from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import LocaleLink from "@/components/LocaleLink/LocaleLink";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";

import { useLocale } from "@/app/providers/LocaleProvider";

import {
    getHostPersonalPageUrl,
    getVolunteerPersonalPageUrl,
} from "@/shared/config/routes/AppUrls";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import styles from "./ReviewSlider.module.scss";

export interface ReviewAuthor {
    name: string;
    avatar: string;
}

export interface Review {
    author?: ReviewAuthor;
    text: string;
    title?: string;
    image?: string;
}

interface ReviewSliderProps {
    reviews: Review[];
    about: "host" | "volunteer";
    className?: string;
    slidesPerView?: number;
    slideClass?: string;
    wrapperClass?: string;
}

export const ReviewSlider: FC<ReviewSliderProps> = (props) => {
    const {
        reviews,
        className,
        about,
        slidesPerView = 1,
        slideClass,
        wrapperClass,
    } = props;
    const { locale } = useLocale();

    const linkTo = about === "host"
        ? getHostPersonalPageUrl(locale, "1")
        : getVolunteerPersonalPageUrl(locale, "1");

    const renderCards = () => reviews.map((review, index) => (
        <SwiperSlide
            key={index}
            className={cn(styles.slideClass, slideClass)}
        >
            <div className={styles.card}>
                <div className={styles.left}>
                    <h3 className={styles.title}>{review.title}</h3>
                    <p className={styles.text}>{review.text}</p>
                    <LocaleLink to={linkTo}>
                        <div className={styles.author}>
                            <Avatar
                                size="SMALL"
                                icon={review.author?.avatar}
                            />
                            <span className={styles.name}>
                                {review.author?.name}
                            </span>
                        </div>
                    </LocaleLink>
                </div>
                {review.image && (
                    <img
                        src={review.image}
                        alt={review.image}
                        className={styles.titleImage}
                    />
                )}
            </div>
        </SwiperSlide>
    ));
    return (
        <div className={cn(styles.wrapper, className)}>
            <Swiper
                spaceBetween={40}
                slidesPerView={slidesPerView}
                modules={[Navigation]}
                navigation
                className={styles.swiper}
                wrapperClass={cn(styles.swiperWrapper, wrapperClass)}
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
                        slidesPerView: 2,
                        spaceBetween: 40,
                    },
                    1200: {
                        slidesPerView,
                        spaceBetween: 40,
                    },
                }}
            >
                {renderCards()}
            </Swiper>
        </div>
    );
};
