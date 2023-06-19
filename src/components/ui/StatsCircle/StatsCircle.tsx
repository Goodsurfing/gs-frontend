import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js';
import React, { FC, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import cn from 'classnames';
import styles from './StatsCircle.module.scss';

import { ProfileFillItems } from 'pages/HostPages/HostDashboardPage/HostProfileFill/HostProfileFill.data';

import { IStatsCircle } from './StatsCircle.types';
import { createDoughnutData } from 'shared/utils/chartJS';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsCircle: FC<IStatsCircle> = ({
  className,
  width = '100px',
  height = '100px',
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
          className={cn(styles.circle, className)}
          width={width}
          height={height}
          data={data}
          options={options}
      />
  );
};

export default StatsCircle;
