import { memo, useState } from "react";
import cn from "classnames";

import styles from "./FillDiagram.module.scss";
import { StatsChart, StatsChartPoints } from "@/entities/Stats";

interface FillDiagramProps {
    className?: string;
    pointsData: StatsChartPoints[];
    isLoading?: boolean;
}

export const FillDiagram = memo((props: FillDiagramProps) => {
    const { className, pointsData, isLoading } = props;

    const [degrees, setDegrees] = useState<[number, number]>([360, 0]);

    if (isLoading) {
        return (
            <div className={cn(styles.wrapper, className)}>
                Загрузка
            </div>
        );
    }

    return (
        <div className={cn(styles.wrapper, className)}>
            <StatsChart
                degrees={degrees}
                onDegreesChange={setDegrees}
                pointsData={pointsData}
            />
        </div>
    );
});
