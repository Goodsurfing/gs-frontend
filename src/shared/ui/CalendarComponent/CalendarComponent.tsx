import React, { forwardRef, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import cn from "classnames";
import styles from "./CalendarComponent.module.scss";
import "./CalendarComponent.scss";
import { ICalendarComponent } from "./types";

const CalendarComponent: React.FC<ICalendarComponent> = forwardRef(
    (props: ICalendarComponent, ref) => {
        const {
            className, value, onChange, locale,
        } = props;
        const onDatePick = useCallback(
            (date: Date) => {
                onChange?.(date);
            },
            [onChange],
        );

        return (
            <Calendar
                ref={ref}
                value={value}
                onChange={(date) => onDatePick(date as Date)}
                defaultValue={new Date()}
                tileClassName={styles.tile}
                className={cn(className, styles.calendar)}
                locale={locale}
            />
        );
    },
);

export default CalendarComponent;
