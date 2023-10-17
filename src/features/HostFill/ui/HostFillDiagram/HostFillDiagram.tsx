import { memo, useState } from "react";
import cn from "classnames";

import styles from "./HostFillDiagram.module.scss";
import { StatsChart, StatsChartPoints } from "@/entities/Stats";

interface HostFillDiagramProps {
    className?: string;
    pointsData: StatsChartPoints[];
    isLoading?: boolean;
}

export const HostFillDiagram = memo((props: HostFillDiagramProps) => {
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
