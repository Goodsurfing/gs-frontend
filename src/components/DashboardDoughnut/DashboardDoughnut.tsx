import { ChartData } from "chart.js";
import Raect, { FC, useState } from "react";

import { ProfileFillItems } from "@/pages/HostPages/HostDashboardPage/HostProfileFill/HostProfileFill.data";

import StatsCircle from "../ui/StatsCircle/StatsCircle";

interface IDashboardDoughnut {
    className?: string;
    text?: string;
    degrees: Array<number>;
    setDegrees: (degrees: Array<number>) => void;
}

const DashboardDoughnut: FC<IDashboardDoughnut> = ({ className, degrees, setDegrees, text, children, ...restDoughnutProps }) => {
    const chartData: ChartData<"doughnut", number[], string> = {
        labels: ["Завершено", "Не завершено"],
        datasets: [
            {
                label: "%",
                data: degrees,
                backgroundColor: ["#22E0A5", "#DFE6EB"],
            },
        ],
    };

    const options = {
        responsive: true,
        elements: {
            center: {
                text: text || '',
                color: 'green',
                sidePadding: 50,
                minFontSize: 26,
                lineHeight: 25,
                ...restDoughnutProps
            }
        },
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <div className={className}>
            <StatsCircle
                pointsData={ProfileFillItems}
                degrees={degrees}
                setDegrees={setDegrees}
                options={options}
                width="110px"
                height="110px"
                data={chartData}
            />        
            {children}
        </div>

    );
};

export default DashboardDoughnut;
