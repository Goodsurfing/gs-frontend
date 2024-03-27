import cn from "classnames";
import { FC, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import styles from "./CalendarComponent.module.scss";
import "./CalendarComponent.scss";
import { ICalendarComponent } from "./types";
import { useLocale } from "@/app/providers/LocaleProvider";

const CalendarComponent: FC<ICalendarComponent> = ({
    className,
    value,
    onChange,
}) => {
    const { locale } = useLocale();

    const onDatePick = useCallback((date: Date) => {
        onChange?.(date);
    }, [onChange]);
    return (
        <Calendar
            value={value}
            onChange={(date) => onDatePick(date as Date)}
            defaultValue={new Date()}
            tileClassName={styles.tile}
            className={cn(className, styles.calendar)}
            locale={locale}
        />
    );
};
export default CalendarComponent;
