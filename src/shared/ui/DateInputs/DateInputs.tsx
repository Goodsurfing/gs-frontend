import cn from "classnames";
import { FC, ReactNode } from "react";
import { Box } from "@mui/material";

import DateInput from "../DateInput/DateInput";

import styles from "./DateInputs.module.scss";

export interface DateInputsProps {
    close: ReactNode;
    min?: Date;
    max?: Date;
    className?: string;
}

const DateInputs: FC<DateInputsProps> = ({
    className,
    close,
    min,
    max,
}) => (
    <Box className={cn(className, styles.wrapper)}>
        <DateInput min={min} className={styles.leftInput} />
        <DateInput max={max} className={styles.rightInput} />
        {close}
    </Box>
);

export default DateInputs;
