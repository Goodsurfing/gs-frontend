import { CalendarProps as Props } from "react-calendar";

type CalendarProps = Omit<Props, "value" | "onChange">;

export interface ICalendarComponent extends CalendarProps {
    value: Date;
    onChange: (value: Date) => void;
}
