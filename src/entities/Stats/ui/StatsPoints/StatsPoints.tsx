import cn from "classnames";
import { memo } from "react";

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

    if (isLoading) {
        return (
            <ul className={cn(styles.wrapper, className)}>
                Загрузка...
            </ul>
        );
    }

    return (
        <ul className={cn(styles.wrapper, className)}>
            {pointsData.map((item) => (
                <TextWithPoint
                    active={item.completed}
                    key={item.text}
                    text={item.text}
                />
            ))}
        </ul>
    );
});
