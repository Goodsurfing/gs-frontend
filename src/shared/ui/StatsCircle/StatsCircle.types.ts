import { ChartData } from "chart.js";

export type DatasetsType = {
    label: string;
    data: Array<number>;
    backgroundColor: Array<string>;
};

export interface IStatsCircle {
    className?: string;
    degrees: [number, number];
    setDegrees: (degrees: [number, number]) => void;
    width?: string;
    height?: string;
    data: ChartData<"doughnut", number[], unknown>;
    options: any;
    pointsData: any;
}
