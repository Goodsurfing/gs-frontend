import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import cn from "classnames";
import { FC, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";

import { ProfileFillItems } from "pages/HostDashboardPage/HostProfileFill/HostProfileFill.data";

import { createDoughnutData } from "shared/lib/chartJS";

import styles from "./StatsCircle.module.scss";
import { IStatsCircle } from "./StatsCircle.types";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsCircle: FC<IStatsCircle> = ({
  className,
  width = "100px",
  height = "100px",
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
  }, [setDegrees]);

  return (
      <Doughnut
          className={cn(styles.circle, className)}
          width={width}
          height={height}
          data={data}
          options={options}
      />
  );
};

export default StatsCircle;
