export interface DatePickerCalendarProps {
    value: Date | undefined;
    onChange: (date: Date) => void;
    min?: Date;
    max?: Date;
    wrapperClassName?: string;
    inputClassName?: string;
    calendarClassName?: string;
    calendarWrapperClassName?: string;
    inputDisabled?: boolean;
    isScrollTo?: boolean;
}
