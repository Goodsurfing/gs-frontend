import cn from "classnames";
import { Box } from "@mui/material";
import { memo, useCallback } from "react";

import DatePickerCalendar from "@/components/DatePickerCalendar/DatePickerCalendar";

import styles from "./DateInputs.module.scss";

export interface DateInputProps {
    min?: Date;
    max?: Date;
    className?: string;
    value?: Date;
    onDateChange?: (value: Date) => void;
}

const DateInput = memo(({
    min, max, className, onDateChange, value = new Date(),
}: DateInputProps) => {
    const handleDateChange = useCallback((date: Date) => {
        onDateChange?.(date);
    }, [onDateChange]);
    return (
        <Box
            sx={{ display: "flex", alignItems: "center", position: "relative" }}
        >
            <DatePickerCalendar
                inputClassName={cn(styles.input, className)}
                onChange={handleDateChange}
                min={min}
                max={max}
                value={value}
            />
        </Box>
    );
});

export default DateInput;
