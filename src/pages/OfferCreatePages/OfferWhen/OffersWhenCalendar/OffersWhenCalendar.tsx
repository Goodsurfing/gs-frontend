import React, { useRef, useState } from "react";

import InputCalendar from "@/components/InputCalendar/InputCalendar";
import CalendarComponent from "@/components/ui/CalendarComponent/CalendarComponent";
import Input from "@/components/ui/Input/Input";

import styles from "./OffersWhenCalendar.module.scss";

const OffersWhenCalendar = () => {
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
        </div>
    );
};

export default OffersWhenCalendar;
