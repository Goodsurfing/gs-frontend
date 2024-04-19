import React, { FC, useCallback } from "react";
import cn from "classnames";
import DateInput from "@/shared/ui/DateInput/DateInput";
import styles from "./Periods.module.scss";

type DatesType = { start: Date, end: Date };

interface PeriodsProps {
    min?: Date;
    max?: Date;
    value: DatesType;
    onDateChange: (periods: DatesType) => void;
    className?: string;
}

export const Periods: FC<PeriodsProps> = (props) => {
    const {
        value, onDateChange, max, min, className,
    } = props;
    const handleFromDateChange = useCallback((date: Date) => {
        onDateChange({ ...value, start: date });
    }, [onDateChange, value]);

    const handleToDateChange = useCallback((date: Date) => {
        onDateChange({ ...value, end: date });
    }, [onDateChange, value]);
    return (
        <div className={cn(styles.wrapper, className)}>
            <DateInput
                className={styles.leftInput}
                onDateChange={handleFromDateChange}
                value={value?.start}
                min={min}
            />
            <DateInput
                className={styles.rightInput}
                onDateChange={handleToDateChange}
                value={value?.end}
                max={max}
            />
        </div>
    );
};
