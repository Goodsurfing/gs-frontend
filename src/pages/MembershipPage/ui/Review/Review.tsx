import cn from "classnames";
import React, { FC, useMemo } from "react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";

import { useTranslation } from "react-i18next";
import reviewPhoto1 from "@/shared/assets/images/membership/review-photo.webp";
import reviewPhoto2 from "@/shared/assets/images/reviews/review-photo-1.webp";
import reviewPhoto3 from "@/shared/assets/images/become-host/whoIsGoodsurfers.webp";
import { ReviewSlide } from "../ReviewSlide/ReviewSlide";
import styles from "./Review.module.scss";

interface ReviewProps {
    className?: string;
}

const data = [
    {
        title: "Крым, Алтай и Байкал",
        reviewText:
            "Как за год стать волонтёром и путешественником со смыслом, найти проект своей мечты, увидеть Крым, Алтай и Байкал, побывать в 7 заповедных территориях, стать участником раскопок древнего царского кургана, пройти Большую Байкальскую тропу и проехать по Транссибу, найти друзей по всей стране и удостоиться звания лучшего Гудсерфера года? Нужно просто захотеть. И ещё любить то дело, которым занимаешься. А Гудсерфинг вам в этом поможет! Сотни мест, десятки людей, возможно, именно сейчас ждут твоей помощи в разных уголках мира. У каждого из вас есть такая же возможность увидеть Россию своими глазами, почувствовать вкус странствий и побывать в уникальных уголках нашей страны. Главное, не упустите этот шанс! Обещаю, вы не пожалеете.",
        image: reviewPhoto1,
        authorName: "Тимур Шафеев",
    },
    {
        title: "Экоферма в Карелии изменила мой взгляд на жизнь",
        reviewText:
            "Я никогда не думала, что месяц на карельской экоферме перевернёт всё с ног на голову. Через Гудсерфинг нашла проект, где помогала выращивать органические овощи, ухаживать за козами и обустраивать туристические тропы в лесу. Физический труд на свежем воздухе, живое общение с местными жителями и такими же путешественниками со всей страны — это совсем другая жизнь. Хозяева фермы стали настоящими друзьями, а навыки пермакультуры, которые я там получила, теперь использую на даче. Вернулась домой другим человеком: спокойнее, осознаннее и с огромным желанием снова отправиться в путь. Гудсерфинг — это не просто платформа для поиска волонтёрских проектов, это целое сообщество людей, которые хотят делать мир чуть лучше.",
        image: reviewPhoto2,
        authorName: "Анна Соколова",
    },
    {
        title: "Камчатка: заповедник и вулканы",
        reviewText:
            "Три недели в заповеднике на Камчатке — мой лучший опыт за последние годы. Помогал инспекторам вести учёт животных, расчищать туристические маршруты и проводить экологические экскурсии для туристов. Условия спартанские: палатки, полевая кухня, медведи в нескольких километрах. Но именно это и делает опыт настоящим. Гудсерфинг нашёл этот проект буквально за пару дней после регистрации. Организаторы встретили как родного, всему обучили и дали возможность увидеть Камчатку не как турист, а как человек, который здесь живёт и работает. Пешие маршруты к вулканам, рыбалка на нерестовых реках, закаты над Тихим океаном — это невозможно описать словами. Только приехать и пережить самому.",
        image: reviewPhoto3,
        authorName: "Михаил Дроздов",
    },
];

export const Review: FC<ReviewProps> = (props: ReviewProps) => {
    const { className } = props;
    const { t } = useTranslation("membership");
    const renderSlides = useMemo(
        () => data.map((review, index) => (
            <SwiperSlide key={index}>
                <ReviewSlide
                    className={styles.slide}
                    title={review.title}
                    reviewText={review.reviewText}
                    image={review.image}
                    authorName={review.authorName}
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
