import plusIcon from "@assets/icons/plus-icon.svg";
import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import React, { FC, useRef, useState } from "react";

import InputCalendar from "@/components/InputCalendar/InputCalendar";

import styles from "./DateInputs.module.scss";
import { IDateInputs } from "./type";

const DateInputs: FC<IDateInputs> = ({ close }) => {
    const [value, setValue] = useState<Date>();

    const onValueChange = () => {};

    const fromDateRef = useRef<HTMLInputElement>(null);
    const toDateRef = useRef<HTMLInputElement>(null);

    return (
        <div className={styles.wrapper}>
            <InputCalendar
                containerClassName={styles.from}
                nextInputRef={fromDateRef}
                ref={toDateRef}
            />
            <InputCalendar containerClassName={styles.to} ref={fromDateRef} />
            {close}
        </div>
    );
};

export default DateInputs;
