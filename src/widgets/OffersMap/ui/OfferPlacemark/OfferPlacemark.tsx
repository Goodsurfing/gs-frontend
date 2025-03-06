import { Placemark, useYMaps } from "@pbe/react-yandex-maps";
import React, { FC, memo } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryType } from "@/types/categories";

import defaultImage from "@/shared/assets/images/default-offer-image.svg";
import { useCategories } from "@/shared/data/categories";

import styles from "./OfferPlacemark.module.scss";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";

interface OfferPlacemarkProps {
    id: string;
    geometry: number[];
    image?: string;
    title: string;
    locale: string;
    category?: CategoryType;
}

export const OfferPlacemark: FC<OfferPlacemarkProps> = memo(
    (props: OfferPlacemarkProps) => {
        const {
            id, title, image, category, geometry, locale,
        } = props;

        const navigate = useNavigate();
        const ymaps = useYMaps();
        const { getColorByCategory, getTranslation } = useCategories();

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
                    balloonContent: `<div id="ballon-offer-${id}" class="offer-card">
                    <div class="${styles.ballonWrapper}">
                        <img class="${styles.ballonImage}" src="${
                image ?? defaultImage
            }"/>
                        <div class="${styles.text}">
                            <span class="${styles.ballonTitle}">${title}</span>
                            <span class="${
            styles.ballonCategory
            }">${getTranslation(category)}</span>
                        </div>
                    </div>
                </div>`,
                    name: title,
                    url: getOfferPersonalPageUrl(locale, id),
                }}
                options={{
                    iconLayout: "default#imageWithContent",
                    iconContentLayout: ymaps?.templateLayoutFactory.createClass(
                        `<div style="background-color: ${category ? getColorByCategory(
                            category,
                        ) : "#FFF"};" class="${styles.customPlacemarkIcon}"></div>`,
                    ),
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
