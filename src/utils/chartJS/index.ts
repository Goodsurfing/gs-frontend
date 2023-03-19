export interface IChartDoughnut {
    text: string;
    color?: string;
    completed: boolean;
}

/**
 *
 * @param itemsCount
 * @param completed
 * @returns
 */

export function calculatePrecentage(itemsCount: number, completed: number) {
    const completedPercent = (100 / itemsCount) * completed;
    const uncompletedPercent = (100 / itemsCount) * (itemsCount - completed);
    return {
        uncompletedPercent,
        completedPercent,
    };
}

/**
 *
 * @param points
 * @returns
 */

export function createDoughnutData(points: IChartDoughnut[]) {
    const total = points.length;
    const completedPoints = points.filter(
        (element) => element.completed === true
    );
    if (completedPoints) {
        const percents = calculatePrecentage(total, completedPoints.length);
        return percents;
    }
    return {
        uncompletedPercent: 360,
        completedPercent: 0,
    };
}
