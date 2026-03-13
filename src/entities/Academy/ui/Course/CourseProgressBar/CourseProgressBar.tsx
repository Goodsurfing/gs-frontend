import { Slider, styled } from "@mui/material";
import cn from "classnames";
import React, { FC } from "react";

import styles from "./CourseProgressBar.module.scss";

interface CourseProgressBarProps {
    className?: string;
    totalLessons: number;
    finishedLessons: number;
}

const CustomSlider = styled(Slider)({
    "& .MuiSlider-thumb": {
        color: "#3DABF7 !important",
        "&:hover, &:focus, &.Mui-active": {
            boxShadow: "0 0 0 8px rgba(61, 171, 247, 0.16)",
        },
    },
    "& .MuiSlider-track": {
        color: "#3DABF7 !important",
        backgroundColor: "#3DABF7 !important",
    },
    "& .MuiSlider-rail": {
        color: "#000000",
    },
});

export const CourseProgressBar: FC<CourseProgressBarProps> = (props) => {
    const { className, finishedLessons, totalLessons } = props;

    const step = 100 / totalLessons;

    const marks = Array.from({ length: totalLessons }, (_, i) => {
        const lessonNumber = i + 1;
        const shouldShowLabel = totalLessons <= 15 || (lessonNumber % 5 === 0);
        return {
            value: (i + 0.5) * step,
            label: shouldShowLabel ? `${lessonNumber} урок` : "",
        };
    });

    let thumbValue;
    if (finishedLessons === 0) {
        thumbValue = 0;
    } else if (finishedLessons === totalLessons) {
        thumbValue = 100;
    } else {
        thumbValue = marks[finishedLessons - 1].value;
    }

    const getValueLabel = () => {
        const getLessonWord = (num: number) => {
            if (num % 10 === 1 && num % 100 !== 11) return "урок";
            if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100)) return "урока";
            return "уроков";
        };
        return `${finishedLessons} ${getLessonWord(finishedLessons)} пройдено`;
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            <h2>Прогресс по курсу</h2>
            <div className={styles.sliderWrapper}>
                <CustomSlider
                    aria-label="Course progress"
                    value={thumbValue}
                    step={step}
                    valueLabelDisplay="auto"
                    valueLabelFormat={getValueLabel}
                    marks={marks}
                />
            </div>
        </div>
    );
};
