import { Slider } from "@mui/material";
import cn from "classnames";
import React, { FC } from "react";

import styles from "./CourseProgressBar.module.scss";

interface CourseProgressBarProps {
    className?: string;
    totalLessons: number;
    finishedLessons: number;
}

export const CourseProgressBar: FC<CourseProgressBarProps> = (props) => {
    const { className, finishedLessons, totalLessons } = props;

    const step = 100 / totalLessons;

    const marks = Array.from({ length: totalLessons }, (_, i) => ({
        value: (i + 0.5) * step,
        label: `${i + 1} урок`,
    }));

    let thumbValue;
    if (finishedLessons === 0) {
        thumbValue = 0;
    } else if (finishedLessons === totalLessons) {
        thumbValue = 100;
    } else {
        thumbValue = marks[finishedLessons - 1].value;
    }

    return (
        <div className={cn(styles.wrapper, className)}>
            <h2>Прогресс по курсу</h2>
            <div className={styles.sliderWrapper}>
                <Slider
                    aria-label="Course progress"
                    value={thumbValue}
                    step={step}
                    valueLabelDisplay="auto"
                    marks={marks}
                />
            </div>
        </div>
    );
};
