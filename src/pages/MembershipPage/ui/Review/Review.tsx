import cn from "classnames";
import React, { FC, useMemo } from "react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";

import { useTranslation } from "react-i18next";
import { ReviewSlide } from "../ReviewSlide/ReviewSlide";
import styles from "./Review.module.scss";

interface ReviewProps {
    className?: string;
}

// fakeData
const data = [
    {
        title: "Крым, Алтай и Байкал",
        reviewText:
            "Как за год стать волонтёром и путешественником со смыслом, найти проект своей мечты, увидеть Крым, Алтай и Байкал, побывать в 7 заповедных территориях, стать участником раскопок древнего царского кургана, пройти Большую Байкальскую тропу и проехать по Транссибу, найти друзей по всей стране и удостоиться звания лучшего Гудсерфера года? Нужно просто захотеть. И ещё любить то дело, которым занимаешься. А Гудсерфинг вам в этом поможет! Сотни мест, десятки людей, возможно, именно сейчас ждут твоей помощи в разных уголках мира.",
    },
    {
        title: "Крым, Алтай и Байкал",
        reviewText:
            "Как за год стать волонтёром и путешественником со смыслом, найти проект своей мечты, увидеть Крым, Алтай и Байкал, побывать в 7 заповедных территориях, стать участником раскопок древнего царского кургана, пройти Большую Байкальскую тропу и проехать по Транссибу, найти друзей по всей стране и удостоиться звания лучшего Гудсерфера года? Нужно просто захотеть. И ещё любить то дело, которым занимаешься. А Гудсерфинг вам в этом поможет! Сотни мест, десятки людей, возможно, именно сейчас ждут твоей помощи в разных уголках мира.",
    },
];

export const Review: FC<ReviewProps> = (props: ReviewProps) => {
    const { className } = props;
    const { t } = useTranslation("membership");
    const renderSlides = useMemo(
        () => data.map((review, index) => (
            <SwiperSlide>
                <ReviewSlide
                    className={styles.slide}
                    title={review.title}
                    reviewText={review.reviewText}
                    key={index}
                />
            </SwiperSlide>
        )),
        [],
    );

    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("what-is-goodsurfing.Отзывы")}</h2>
            <Swiper
                className={styles.swiper}
                modules={[Navigation, Pagination]}
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
