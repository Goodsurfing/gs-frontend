import React, { FC, memo } from "react";

import { Placemark } from "@pbe/react-yandex-maps";
import { useNavigate } from "react-router-dom";
import styles from "./OfferPlacemark.module.scss";

interface OfferPlacemarkProps {
    id: string;
    geometry: number[];
    image: string;
    title: string;
    locale: string
}

export const OfferPlacemark: FC<OfferPlacemarkProps> = memo(
    (props: OfferPlacemarkProps) => {
        const {
            id,
            title,
            image,
            geometry,
            locale,
        } = props;

        const navigate = useNavigate();

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
                    preset: "islands#blueDotIcon",
                    hideIconOnBalloonOpen: false,
                    openEmptyBalloon: false,
                }}
                onBalloonOpen={handleBalloonOpen}
                onBalloonClose={handleBalloonClose}
            />
        );
    },
);
