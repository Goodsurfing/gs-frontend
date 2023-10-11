import React, { FC, useState } from "react";

import { ReviewCardOffer } from "../ReviewCardOffer/ReviewCardOffer";
import { ReviewOffer } from "../../model/types/reviewAboutOffers";

import styles from "./ReviewAboutOffers.module.scss";

export const ReviewAboutOffers: FC = () => {
    const [fakeData] = useState<ReviewOffer[]>([
        {
            id: 1,
            author: "Семён Володарский",
            authorAvatar: "",
            date: new Date("2023-10-11"),
            rating: 3,
            textReview: "Кемпхилл стал для меня местом, куда я всегда могу вернуться. Ведь меня там любят и всегда мне рады. Под его крышей собираются замечательные люди с огромными сердцами. Только там я наконец-то смогла научиться принимать людей такими, какие они есть, без желания их исправить, а просто-напросто полюбить. Для меня это был совершенно уникальный опыт : совместная работа, приёмы пищи за одним бооольшим столом (передайте, пожалуйста, масло!)))), совместная подготовка к мероприятиям, таким как Библейский и музыкальный вечер, поездка в парк аттракционов или репетиция театральной постановки. Кемпхилл сделал меня частью своей семьи и по-настоящему нужным в ней элементом.",
            title: "Добро пожаловать в кемпхилл Чистые Ключи!",
        },
        {
            id: 2,
            author: "Семён Володарский",
            authorAvatar: "",
            date: new Date("2023-10-11"),
            rating: 3,
            textReview: "text review",
            title: "Добро пожаловать в кемпхилл Чистые Ключи!",
        },
        {
            id: 3,
            author: "Семён Володарский",
            authorAvatar: "",
            date: new Date("2023-10-11"),
            rating: 3,
            textReview: "text review",
            title: "Добро пожаловать в кемпхилл Чистые Ключи!",
        },
        {
            id: 4,
            author: "Семён Володарский",
            authorAvatar: "",
            date: new Date("2023-10-11"),
            rating: 3,
            textReview: "text review",
            title: "Добро пожаловать в кемпхилл Чистые Ключи!",
        },
    ]);

    const renderCardOffers = (reviewOffers:ReviewOffer[]) => reviewOffers.map((reviewOffer) => <ReviewCardOffer reviewOffer={reviewOffer} />);

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.h3}>Отзывы о ваших проектах</h3>
            <div className={styles.cardContainer}>
                {renderCardOffers(fakeData)}
            </div>
        </div>
    );
};
