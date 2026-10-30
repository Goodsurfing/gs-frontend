import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { useGetAbouProjectPageInfoQuery } from "@/entities/Admin";

import { formatStatNumber } from "@/shared/lib/formatStat";

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
    const { locale } = useLocale();
    const { data, isLoading, isError } = useGetAbouProjectPageInfoQuery();

    if (isLoading || isError || !data) return null;

    const { today } = data;

    return (
        <div className={cn(styles.content, className)}>
            <GoodsurfingStatsItem
                title={formatStatNumber(today.volunteerCount, locale)}
                description={t("гудсёрферов")}
            />
            <GoodsurfingStatsItem
                title={formatStatNumber(today.vacancyCountryCount, locale)}
                description={t("стран")}
            />
            <GoodsurfingStatsItem
                title={formatStatNumber(today.vacancyCount, locale)}
                description={t("вакансий")}
            />
            <GoodsurfingStatsItem
                title={formatStatNumber(today.reviewCount, locale)}
                description={t("отзывов")}
            />
        </div>
    );
};
