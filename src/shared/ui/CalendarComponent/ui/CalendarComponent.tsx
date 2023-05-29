import cn from "classnames";
import React, { FC, memo } from "react";
import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

import "./CalendarComponent.scss";
import styles from "./CalendarComponent.module.scss";

export interface ICalendarComponent {
  value: Date;
  onChange: (value: Date) => void;
  className: string;
}

const CalendarComponent: FC<ICalendarComponent> = ({
  className,
  value,
  onChange,
}) => (
    <Calendar
        value={value}
        onChange={(value: Date) => onChange(value)}
        defaultValue={new Date()}
        tileClassName={styles.tile}
        className={cn(className, styles.calendar)}
    />
);

export const MemoCalendarComponent = memo(CalendarComponent);
