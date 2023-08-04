export interface DatePickerCalendarProps {
    value: Date;
    onChange: (date: Date) => void;
    min?: Date;
    max?: Date;
    wrapperClassName?: string;
    inputClassName?: string;
    calendarClassName?: string;
}
