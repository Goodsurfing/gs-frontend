import cn from 'classnames';
import React, { FC } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import './CalendarComponent.scss';
import styles from './CalendarComponent.module.scss';

interface ICalendarComponent {
    className?: string;
}

const CalendarComponent: FC<ICalendarComponent> = ({ className }) => (
    <Calendar
        tileClassName={styles.tile}
        className={cn(className, styles.calendar)}
    />
);

export default CalendarComponent;
