import cn from "classnames";
import React, { FC } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import styles from "./CalendarComponent.module.scss";
import "./CalendarComponent.scss";
import { ICalendarComponent } from "./types";

const CalendarComponent: FC<ICalendarComponent> = ({
    className,
    value,
    onValueChange,
}) => {
    return (
        <Calendar
            onChange={onValueChange}
            defaultValue={new Date()}
            tileClassName={styles.tile}
            className={cn(className, styles.calendar)}
        />
    );
};

export default CalendarComponent;
