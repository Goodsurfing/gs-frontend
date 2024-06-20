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
    inputDisabled?: boolean;
    calendarClassName?: string;
    calendarWrapperClassName?: string;
    isScrollTo?: boolean;
}

const DateInput = memo(({
    min, max, className, onDateChange, value, inputDisabled, calendarClassName,
    calendarWrapperClassName, isScrollTo,
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
                inputDisabled={inputDisabled}
                calendarClassName={calendarClassName}
                calendarWrapperClassName={calendarWrapperClassName}
                isScrollTo={isScrollTo}
            />
        </Box>
    );
});

export default DateInput;
