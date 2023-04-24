import { CalendarProps } from "react-calendar";

export interface ICalendarComponent extends CalendarProps {
    value: Date;
    onChange: (value: Date) => void;
}
