import {
    ArcElement,
    ChartData,
    Chart as ChartJS,
    Legend,
    Tooltip,
} from "chart.js";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";

import { ProfileFillItems } from "@/pages/HostRegistrationPages/HostDashboardPage/HostProfileFill/HostProfileFill.data";

import { IStatsCircle } from "./StatsCircle.types";
import { createDoughnutData } from "@/utils/chartJS";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsCircle: FC<IStatsCircle> = ({
    width='100px',
    height='100px',
    setDegrees,
    data,
    options,
}) => {

    useEffect(() => {
        const createdDegrees = createDoughnutData(ProfileFillItems);
        setDegrees([
            createdDegrees.completedPercent,
            createdDegrees.uncompletedPercent,
        ]);
    }, []);

    return (
        <Doughnut
            width={width}
            height={height}
            data={data}
            options={options}
        />
    );
};

export default StatsCircle;
