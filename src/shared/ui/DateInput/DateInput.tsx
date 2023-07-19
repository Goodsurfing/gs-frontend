import cn from "classnames";
import { Box } from "@mui/material";
import { FC, useState } from "react";

import DatePickerCalendar from "@/components/DatePickerCalendar/DatePickerCalendar";

import styles from "./DateInputs.module.scss";

export interface DateInputProps {
    min?: Date;
    max?: Date;
    className?: string;
}

const DateInput: FC<DateInputProps> = ({ min, max, className }) => {
    const [date, setDate] = useState<Date>(new Date());

    return (
        <Box
            sx={{ display: "flex", alignItems: "center", position: "relative" }}
        >
            <DatePickerCalendar
                inputClassName={cn(styles.input, className)}
                onChange={setDate}
                min={min}
                max={max}
                value={date}
            />
        </Box>
    );
};

export default DateInput;
