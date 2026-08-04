import { ButtonBase } from "@mui/material";
import cn from "classnames";
import { memo, useState } from "react";
import { ReactSVG } from "react-svg";
import { useTranslation } from "react-i18next";

import myLocationIcon from "@/shared/assets/icons/my-location.svg";

import styles from "./GeolocationControl.module.scss";

// "В рамках города" — Яндекс.Карты на этом масштабе показывают город
// целиком, а не двор/дом (как обычно зумит нативный GeolocationControl,
// ориентируясь на точность geolocation API). FOCUS_ZOOM в OffersMap.tsx
// (10) используется для фокуса на ОДНОМ маркере вакансии — тут же нужен
// чуть более широкий масштаб, показывающий город целиком, а не одну точку.
const CITY_ZOOM = 11;
const GEOLOCATION_TIMEOUT_MS = 10_000;

interface GeolocationControlProps {
    // ymaps.Map — типизирован как any, т.к. @pbe/react-yandex-maps не
    // экспортирует полноценный тип инстанса карты (см. mapRef в
    // OffersMap.tsx/DonationsMap.tsx, там та же ситуация).
    mapInstance: any;
    className?: string;
}

export const GeolocationControl = memo(({ mapInstance, className }: GeolocationControlProps) => {
    const { t } = useTranslation();
    const [isLocating, setIsLocating] = useState(false);
    const [hasError, setHasError] = useState(false);

    const label = t("Показать моё местоположение");
    const errorLabel = t("Не удалось определить местоположение");

    const handleClick = () => {
        if (!mapInstance || !navigator.geolocation) {
            setHasError(true);
            return;
        }

        setHasError(false);
        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLocating(false);
                mapInstance.setCenter(
                    [position.coords.latitude, position.coords.longitude],
                    CITY_ZOOM,
                    { duration: 400 },
                );
            },
            () => {
                setIsLocating(false);
                setHasError(true);
            },
            { enableHighAccuracy: false, timeout: GEOLOCATION_TIMEOUT_MS, maximumAge: 60_000 },
        );
    };

    return (
        <ButtonBase
            type="button"
            className={cn(styles.btn, className, { [styles.locating]: isLocating })}
            onClick={handleClick}
            aria-label={label}
            title={hasError ? errorLabel : label}
        >
            <ReactSVG className={styles.icon} src={myLocationIcon} />
        </ButtonBase>
    );
});
