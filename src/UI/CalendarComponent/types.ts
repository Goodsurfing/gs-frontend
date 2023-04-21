export interface ICalendarComponent {
    className?: string;
    value?: Date;
    onValueChange?: (value: Date) => void;
}
