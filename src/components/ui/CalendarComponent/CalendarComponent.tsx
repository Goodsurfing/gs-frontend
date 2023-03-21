import React, { FC } from "react";
import Calendar from "react-calendar";

import styles from "./CalendarComponent.module.scss";

import cn from "classnames";

interface ICalendarComponent {
    className?: string;
}

const CalendarComponent: FC<ICalendarComponent> = ({ className }) => {
    return <Calendar className={cn(className, styles.calendar)} />;
};

export default CalendarComponent;
