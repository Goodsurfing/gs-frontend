import React, { FC, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";

import { ReviewFullCard } from "../ReviewFullCard/ReviewFullCard";
import { ReviewMiniCard } from "../ReviewMiniCard/ReviewMiniCard";
import {
    userCardFullInfo,
    userCardInfo,
} from "./model/types/reviewAboutVolunteers";

import styles from "./ReviewAboutVolunteers.module.scss";

export const ReviewAboutVolunteers: FC = () => {
    const [fakeData] = useState<userCardInfo[]>([
        {
            id: 1,
            name: "Семён",
            surname: "Володарский",
            avatar: "",
            city: "Москва",
            country: "Россия",
        },
        {
            id: 2,
            name: "Семён",
            surname: "Володарский",
            avatar: "",
            city: "Москва",
            country: "Россия",
        },
        {
            id: 3,
            name: "Семён",
            surname: "Володарский",
            avatar: "",
            city: "Москва",
            country: "Россия",
        },
        {
            id: 4,
            name: "Семён",
            surname: "Володарский",
            avatar: "",
            city: "Москва",
            country: "Россия",
        },
        {
            id: 5,
            name: "Семён",
            surname: "Володарский",
            avatar: "",
            city: "Москва",
            country: "Россия",
        },
        {
            id: 6,
            name: "Семён",
            surname: "Володарский",
            avatar: "",
            city: "Москва",
            country: "Россия",
        },
        {
            id: 7,
            name: "Семён",
            surname: "Володарский",
            avatar: "",
            city: "Москва",
            country: "Россия",
        },
    ]);

    const [fakeUserData] = useState<userCardFullInfo[]>([
        {
            id: 1,
            name: "Семён",
            surname: "Володарский",
            avatar: "",
            city: "Москва",
            country: "Россия",
            textReview:
                "Мне его посоветовала родственница, которой, в свою очередь, его посоветовала подружка много-много лет назад… Вспоминаю с улыбкой эту рассказанную историю)))",
        },
        {
            id: 2,
            name: "Семён",
            surname: "Володарский",
            avatar: "",
            city: "Москва",
            country: "Россия",
            textReview:
                "Мне его посоветовала родственница, которой, в свою очередь, его посоветовала подружка много-много лет назад… Вспоминаю с улыбкой эту рассказанную историю)))",
        },
        {
            id: 3,
            name: "Семён",
            surname: "Володарский",
            avatar: "",
            city: "Москва",
            country: "Россия",
            textReview:
                "Мне его посоветовала родственница, которой, в свою очередь, его посоветовала подружка много-много лет назад… Вспоминаю с улыбкой эту рассказанную историю)))",
        },
    ]);
    return (
        <div className={styles.wrapper}>
            <h3 className={styles.h3}>Отзывы про волонтёров</h3>
            <p className={styles.description}>Волонтёры, которых вы недавно принимали</p>
            <VerticalSlider
                className={styles.slider}
                data={fakeData}
                renderItem={(item: userCardInfo) => (
                    <ReviewMiniCard data={item} />
                )}
            />
            <div className={styles.fullCardContainer}>
                <ReviewFullCard data={fakeUserData[0]} />
                <ReviewFullCard data={fakeUserData[0]} />
                <ReviewFullCard data={fakeUserData[0]} />

            </div>
        </div>
    );
};
