import { memo } from "react";
import { ChartData } from "chart.js";
import cn from "classnames";

import StatsCircle from "@/shared/ui/StatsCircle/StatsCircle";

import { StatsChartPoints } from "../../model/types/chart";

import styles from "./StatsChart.module.scss";

interface StatsChartProps {
    className?: string;
    text?: string;
    degrees: [number, number];
    onDegreesChange: (degrees: [number, number]) => void;
    pointsData: StatsChartPoints[];
}

export const StatsChart = memo((props: StatsChartProps) => {
    const {
        degrees,
        onDegreesChange,
        className,
        pointsData,
        text = "",
    } = props;

    const chartData: ChartData<"doughnut", number[], string> = {
        labels: ["Завершено", "Не завершено"],
        datasets: [{
            label: "%",
            data: degrees,
            backgroundColor: ["#22E0A5", "#DFE6EB"],
        }],

    };

    const options = {
        responsive: true,
        elements: {
            center: {
                text,
                color: "green",
                sidePadding: 50,
                minFontSize: 26,
                lineHeight: 25,
            },
        },
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            <StatsCircle
                pointsData={pointsData}
                degrees={degrees}
                setDegrees={onDegreesChange}
                options={options}
                width="110px"
                height="110px"
                data={chartData}
            />
            <div className={styles.percents}>
                {degrees[0]}
                %
            </div>
        </div>
    );
});
