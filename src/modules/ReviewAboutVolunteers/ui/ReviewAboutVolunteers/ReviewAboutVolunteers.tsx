import React, { FC, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";

import { ReviewFullCard } from "../ReviewFullCard/ReviewFullCard";
import { ReviewMiniCard } from "../ReviewMiniCard/ReviewMiniCard";
import styles from "./ReviewAboutVolunteers.module.scss";
import {
    userCardFullInfo,
    userCardInfo,
} from "./model/types/reviewAboutVolunteers";

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
            <h4>Отзывы про волонтёров</h4>
            <p>Волонтёры, которых вы недавно принимали</p>
            <VerticalSlider
                data={fakeData}
                renderItem={(item: userCardInfo) => (
                    <ReviewMiniCard data={item} />
                )}
            />
            <ReviewFullCard data={fakeUserData[0]} />
        </div>
    );
};
