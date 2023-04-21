import { RefObject } from "react";

export interface IInputCalendar extends React.InputHTMLAttributes<HTMLInputElement> {
    wrapperClassName?: string;
    containerClassName?: string;
    inputClassName?: string;
    imgClassName?: string;
    calendarClassName?: string;
    onValueChange?: (value: Date) => void;
    nextInputRef?: RefObject<HTMLInputElement>;
}