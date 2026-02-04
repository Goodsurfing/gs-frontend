import cn from "classnames";
import { memo } from "react";

import { useTranslation } from "react-i18next";
import { StatsChartPoints } from "../../model/types/chart";

import styles from "./StatsPoints.module.scss";
import { TextWithPoint } from "@/shared/ui/TextWithPoint/TextWithPoint";

interface StatsPointsProps {
    className?: string;
    pointsData: StatsChartPoints[];
    isLoading?: boolean;
}

export const StatsPoints = memo((props: StatsPointsProps) => {
    const { className, pointsData, isLoading } = props;
    const { t } = useTranslation("translation");

    const transalteLib: Record<string, string> = {
        Описание: t("stats-points.Описание"),
        Вакансии: t("stats-points.Предложения"),
        "О себе": t("stats-points.О себе"),
        Отзывы: t("stats-points.Отзывы"),
        Навыки: t("stats-points.Навыки"),
        Фото: t("stats-points.Фотографии"),
        Видео: t("stats-points.Видео"),
        "Публикации в блоге": t("stats-points.Публикации в блоге"),
        Членство: t("stats-points.Членство"),
    };

    if (isLoading) {
        return (
            <ul className={cn(styles.wrapper, className)}>
                {t("Загрузка...")}
            </ul>
        );
    }

    return (
        <ul className={cn(styles.wrapper, className)}>
            {pointsData.map((item) => (
                <TextWithPoint
                    active={item.completed}
                    key={item.text}
                    text={transalteLib[item.text]}
                />
            ))}
        </ul>
    );
});
