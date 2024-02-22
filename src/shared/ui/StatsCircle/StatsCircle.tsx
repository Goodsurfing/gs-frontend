import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip,
} from "chart.js";
import { memo, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import cn from "classnames";
import styles from "./StatsCircle.module.scss";

import { IStatsCircle } from "./StatsCircle.types";
import { createDoughnutData } from "@/shared/utils/chartJS";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsCircle = memo((props: IStatsCircle) => {
    const {
        className,
        width = "100px",
        height = "100px",
        setDegrees,
        data,
        pointsData,
        options,
    } = props;

    useEffect(() => {
        const createdDegrees = createDoughnutData(pointsData);
        setDegrees([
            createdDegrees.completedPercent,
            createdDegrees.uncompletedPercent,
        ]);
    }, [setDegrees, pointsData]);

    return (
        <Doughnut
            className={cn(styles.circle, className)}
            width={width}
            height={height}
            data={data}
            options={options}
        />
    );
});

export default StatsCircle;
