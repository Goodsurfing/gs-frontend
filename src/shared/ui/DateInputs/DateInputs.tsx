import cn from "classnames";
import {
    FC, ReactNode, useCallback,
} from "react";
import { Box } from "@mui/material";

import DateInput from "../DateInput/DateInput";

import styles from "./DateInputs.module.scss";

type DatesType = { start: Date | undefined, end: Date | undefined };

export interface DateInputsProps {
    close: ReactNode;
    min?: Date;
    max?: Date;
    value: DatesType;
    onDateChange: (periods: DatesType) => void;
    className?: string;
}

const DateInputs: FC<DateInputsProps> = ({
    className,
    close,
    value,
    onDateChange,
    min,
    max,
}) => {
    const handleFromDateChange = useCallback((date: Date) => {
        if (value.end) {
            if (date > value.end) {
                onDateChange({ ...value, start: date, end: date });
                return;
            }
        } else {
            onDateChange({ ...value, start: date, end: date });
            return;
        }
        onDateChange({ ...value, start: date });
    }, [onDateChange, value]);

    const handleToDateChange = useCallback((date: Date) => {
        if (!value.start) {
            onDateChange({ ...value, start: new Date(), end: date });
        } else {
            if (date < value.start) return;
            onDateChange({ ...value, end: date });
        }
    }, [onDateChange, value]);

    return (
        <Box className={cn(className, styles.wrapper)}>
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
                min={new Date()}
                max={max}
                calendarWrapperClassName={styles.calendarWrapper}
            />
            {close}
        </Box>
    );
};

export default DateInputs;
