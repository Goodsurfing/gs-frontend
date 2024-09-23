import React, { FC, useCallback } from "react";
import cn from "classnames";
import DateInput from "@/shared/ui/DateInput/DateInput";
import styles from "./Periods.module.scss";

type DatesType = { start: Date | undefined, end: Date | undefined };

interface PeriodsProps {
    min?: Date;
    max?: Date;
    value: DatesType;
    onDateChange: (periods: DatesType) => void;
    className?: string;
    wrapperClassName?: string;
}

export const Periods: FC<PeriodsProps> = (props) => {
    const {
        value, onDateChange, max, min, className, wrapperClassName,
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
                wrapperClassName={wrapperClassName}
                calendarWrapperClassName={styles.datePicker}
                onDateChange={handleFromDateChange}
                value={value?.start}
                min={min}
            />
            <DateInput
                wrapperClassName={wrapperClassName}
                calendarWrapperClassName={styles.datePicker}
                className={styles.rightInput}
                onDateChange={handleToDateChange}
                value={value?.end}
                max={max}
            />
        </div>
    );
};
