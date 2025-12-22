import { Placemark, useYMaps } from "@pbe/react-yandex-maps";
import React, {
    FC, memo, useCallback, useEffect,
    useRef,
} from "react";
import { useNavigate } from "react-router-dom";

import defaultImage from "@/shared/assets/images/default-offer-image.png";
import { useCategories } from "@/shared/data/categories";

import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLazyGetOfferByIdQuery } from "@/entities/Offer";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./OfferPlacemark.module.scss";
import { textSlice } from "@/shared/lib/textSlice";

interface OfferPlacemarkProps {
    id: string;
    geometry: number[];
    name: string;
    categoryColor?: string;
    locale: string;
}

export const OfferPlacemark: FC<OfferPlacemarkProps> = memo((props: OfferPlacemarkProps) => {
    const {
        id, categoryColor, name, geometry, locale,
    } = props;

    const navigate = useNavigate();
    const ymaps = useYMaps();
    const { getTranslation } = useCategories();
    const [getOffer, {
        data: offerData, isLoading, isUninitialized, error,
    }] = useLazyGetOfferByIdQuery();

    const placemarkRef = useRef<any>(null);

    const handleClick = useCallback(() => {
        navigate(getOfferPersonalPageUrl(locale, id));
    }, [locale, id, navigate]);

    const updateBalloonContent = useCallback(() => {
        const element = document.getElementById(`ballon-offer-${id}`);
        if (!element) return;

        if (isLoading) {
            element.innerHTML = `<div class="${styles.loading}">Загрузка...</div>`;
            element.removeEventListener("click", handleClick);
            return;
        }

        if (error || (!offerData && !isUninitialized)) {
            element.innerHTML = `<div class="${styles.error}">Произошла ошибка</div>`;
            element.removeEventListener("click", handleClick);
            return;
        }

        if (offerData) {
            const imgSrc = offerData.description?.image?.contentUrl ?? defaultImage;
            const title = offerData.description?.title || "Без названия";
            const categoryName = (offerData.description?.categories?.[0]?.name
                    && getTranslation(offerData.description.categories[0].name))
                || "";

            element.innerHTML = `
                <div class="${styles.ballonWrapper}">
                    <img class="${styles.ballonImage}" src="${getMediaContent(imgSrc, "SMALL")}" />
                    <div class="${styles.text}">
                        <span class="${styles.ballonTitle}">${textSlice(title, 30, "title")}</span>
                        <span class="${styles.ballonCategory}">${categoryName}</span>
                    </div>
                </div>
            `;

            element.addEventListener("click", handleClick);
        }
    }, [id, isLoading, isUninitialized, offerData, error, getTranslation, handleClick]);

    const handleBalloonOpen = useCallback(() => {
        getOffer(id);
    }, [id, getOffer]);

    useEffect(() => {
        if (!isUninitialized || isLoading || offerData || error) {
            updateBalloonContent();
        }
    }, [isUninitialized, isLoading, offerData, error, updateBalloonContent]);

    useEffect(() => () => {
        const element = document.getElementById(`ballon-offer-${id}`);
        if (element) {
            element.removeEventListener("click", handleClick);
        }
    }, [id, handleClick]);

    return (
        <Placemark
            instanceRef={placemarkRef}
            geometry={geometry}
            properties={{
                balloonContent: `<div id="ballon-offer-${id}" class="offer-card"><div class="${styles.loading}">Загрузка...</div></div>`,
                name,
                url: getOfferPersonalPageUrl(locale, id),
            }}
            options={{
                iconLayout: "default#imageWithContent",
                iconContentLayout: ymaps?.templateLayoutFactory?.createClass?.(
                    `<div style="background-color: ${categoryColor || "var(--accent-color)"};" class="${styles.customPlacemarkIcon}"></div>`,
                ),
                hideIconOnBalloonOpen: false,
                openEmptyBalloon: false,
                iconImageSize: [35, 35],
                iconImageOffset: [-15, -15],
                balloonPanelMaxMapArea: 0,
                balloonMinWidth: 200,
                balloonMinHeight: 60,
            }}
            onBalloonOpen={handleBalloonOpen}
        />
    );
});
