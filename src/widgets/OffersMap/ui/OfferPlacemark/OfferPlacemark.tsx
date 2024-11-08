import React, { FC, memo } from "react";

import { Placemark, useYMaps } from "@pbe/react-yandex-maps";
import { useNavigate } from "react-router-dom";
import styles from "./OfferPlacemark.module.scss";
import { CategoryType } from "@/types/categories";
import { useCategories } from "@/shared/data/categories";

interface OfferPlacemarkProps {
    id: string;
    geometry: number[];
    image: string;
    title: string;
    locale: string;
    category: CategoryType;
}

export const OfferPlacemark: FC<OfferPlacemarkProps> = memo(
    (props: OfferPlacemarkProps) => {
        const {
            id,
            title,
            image,
            category,
            geometry,
            locale,
        } = props;

        const navigate = useNavigate();
        const ymaps = useYMaps();
        const { getColorByCategory } = useCategories();

        const handleClick = () => {
            navigate(`/${locale}/offer-personal/${id}`);
        };

        const handleBalloonOpen = () => {
            const element = document.getElementById(`ballon-offer-${id}`);
            if (element) {
                element.addEventListener("click", handleClick);
            }
        };

        const handleBalloonClose = () => {
            const element = document.getElementById(`ballon-offer-${id}`);
            if (element) {
                element.removeEventListener("click", handleClick);
            }
        };

        return (
            <Placemark
                key={id}
                geometry={geometry}
                properties={{
                    balloonContent:
                `<div id="ballon-offer-${id}" class="offer-card">
                    <div class="${styles.ballonWrapper}">
                        <img class="${styles.ballonImage}" src="${image}"/>
                        <span class="${styles.ballonTitle}">${title}</span>
                    </div>
                </div>`,
                }}
                options={{
                    iconLayout: "default#imageWithContent",
                    iconContentLayout: ymaps?.templateLayoutFactory.createClass(`<div style="background-color: ${getColorByCategory(category)};" class="${styles.customPlacemarkIcon}"></div>`),
                    hideIconOnBalloonOpen: false,
                    openEmptyBalloon: false,
                    iconImageSize: [30, 30],
                    iconImageOffset: [-15, -15],
                }}
                onBalloonOpen={handleBalloonOpen}
                onBalloonClose={handleBalloonClose}
            />
        );
    },
);
