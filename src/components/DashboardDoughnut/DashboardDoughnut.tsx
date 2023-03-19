import { ChartData } from "chart.js";
import Raect, { FC, useState } from "react";

import { ProfileFillItems } from "@/pages/HostRegistrationPages/HostDashboardPage/HostProfileFill/HostProfileFill.data";

import StatsCircle from "../ui/StatsCircle/StatsCircle";

const DashboardDoughnut: FC = () => {
    const [degrees, setDegrees] = useState<Array<number>>([360, 0]);

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
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <StatsCircle
            pointsData={ProfileFillItems}
            degrees={degrees}
            setDegrees={setDegrees}
            options={options}
            width="110px"
            height="110px"
            data={chartData}
        />
    );
};

export default DashboardDoughnut;
