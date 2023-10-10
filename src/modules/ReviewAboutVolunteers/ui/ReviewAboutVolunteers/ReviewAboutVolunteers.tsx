import React, { useState, FC } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./ReviewAboutVolunteers.module.scss";
import { VerticalSlider } from "@/shared/ui/VerticalSlider/VerticalSlider";
import { userCardInfo } from "./model/types/reviewAboutVolunteers";
import { ReviewMiniCard } from "../ReviewMiniCard/ReviewMiniCard";

export const ReviewAboutVolunteers: FC = () => {
    const [fakeData] = useState<userCardInfo[]>([{
        id: 1,
        name: "Семён",
        surname: "Володарский",
        avatar: "",
        city: "Москва",
        country: "Россия",
    }, {
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
    }, {
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
    }]);
    return (
        <div className={styles.wrapper}>
            <h4>Отзывы про волонтёров</h4>
            <p>Волонтёры, которых вы недавно принимали</p>
            <VerticalSlider data={fakeData} renderItem={(item:userCardInfo) => <ReviewMiniCard data={item} />} />

        </div>
    );
};
