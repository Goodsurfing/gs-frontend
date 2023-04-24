import React, { FC, useState } from "react";

import styles from "./DateInputs.module.scss";
import { IDateInputs } from "./type";
import DatePickerCalendar from "@/components/DatePickerCalendar/DatePickerCalendar";

const DateInputs: FC<IDateInputs> = ({ close, from, to }) => {
    const [date, setDate] = useState<Date>(new Date);

    return (
        <div className={styles.wrapper}>
            <DatePickerCalendar inputClassName={styles.leftCalendar} onChange={setDate} min={from} value={date} />
            <DatePickerCalendar inputClassName={styles.rightCalendar} onChange={setDate} max={to} value={date} />
            {close}
        </div>
    );
};

export default DateInputs;
