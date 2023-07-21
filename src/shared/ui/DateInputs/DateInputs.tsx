import cn from "classnames";
import { FC, ReactNode, useCallback, useState } from "react";
import { Box } from "@mui/material";

import DateInput from "../DateInput/DateInput";

import styles from "./DateInputs.module.scss";

type DatesType = { from: Date, to: Date };

export interface DateInputsProps {
    close: ReactNode;
    min?: Date;
    max?: Date;
    value?: DatesType;
    onDateChange?: (periods: DatesType) => void;
    className?: string;
}

const DateInputs: FC<DateInputsProps> = ({
    className,
    close,
    value = { from: new Date(), to: new Date() },
    onDateChange,
    min,
    max,
}) => {
    const handleFromDateChange = useCallback((date: Date) => {
        onDateChange?.({ ...value, from: date });
    }, [onDateChange, value]);

    const handleToDateChange = useCallback((date: Date) => {
        onDateChange?.({ ...value, to: date });
    }, [onDateChange, value]);

    return (
    <Box className={cn(className, styles.wrapper)}>
        <DateInput
            className={styles.leftInput}
            onDateChange={handleFromDateChange}
            value={value.from}
            min={min}
        />
        <DateInput
            className={styles.rightInput}
            onDateChange={handleToDateChange}
            value={value.to}
            max={max}
        />
        {close}
    </Box>
)};

export default DateInputs;
