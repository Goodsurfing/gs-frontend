import { FC, ReactNode } from "react";
import { Box } from "@mui/material";

import DateInput from "../DateInput/DateInput";
import styles from "./DateInputs.module.scss";

export interface DateInputsProps {
    close: ReactNode;
    min?: Date;
    max?: Date;
}

const DateInputs: FC<DateInputsProps> = ({
    close,
    min,
    max,
}) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
        }}
    >
        <DateInput min={min} className={styles.leftInput} />
        <DateInput max={max} className={styles.rightInput} />
        {close}
    </Box>
);

export default DateInputs;
