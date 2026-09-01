import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { useGetAbouProjectPageInfoQuery } from "@/entities/Admin";

import { GoodsurfingStatsItem } from "../GoodsurfingStatsItem/GoodsurfingStatsItem";
import styles from "./GoodsurfingStats.module.scss";

interface GoodsurfingStatsProps {
    className?: string;
}

// Реальные цифры из БД (волонтёры/страны/вакансии/отзывы) — раньше на
// главной их не было вообще, только на /about-project. Переиспользуем тот
// же today-эндпоинт вместо дублирования логики подсчёта на бэке.
export const GoodsurfingStats: FC<GoodsurfingStatsProps> = ({ className }) => {
    const { t } = useTranslation("about-project");
    const { data, isLoading, isError } = useGetAbouProjectPageInfoQuery();

    if (isLoading || isError || !data) return null;

    const { today } = data;

    return (
        <div className={cn(styles.content, className)}>
            <GoodsurfingStatsItem
                title={today.volunteerCount.toString()}
                description={t("гудсёрферов")}
            />
            <GoodsurfingStatsItem
                title={today.vacancyCountryCount.toString()}
                description={t("стран")}
            />
            <GoodsurfingStatsItem
                title={today.vacancyCount.toString()}
                description={t("вакансий")}
            />
            <GoodsurfingStatsItem
                title={today.reviewCount.toString()}
                description={t("отзывов")}
            />
        </div>
    );
};
