import calendarIcon from "@assets/icons/calendar.svg";
import cn from "classnames";
import React, {
    FC,
    RefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Calendar from "react-calendar";

import filterInputDate from "@/utils/date/filterInputDate";
import { setComponentRefs } from "@/utils/refs/setComponentRefs";

import styles from "./InputCalendar.module.scss";

interface IInputCalendar extends React.InputHTMLAttributes<HTMLInputElement> {
    wrapperClassName?: string;
    containerClassName?: string;
    inputClassName?: string;
    imgClassName?: string;
    calendarClassName?: string;
    onValueChange?: (value: Date) => void;
    nextInputRef?: RefObject<HTMLInputElement>;
}

const InputCalendar = React.forwardRef<HTMLInputElement, IInputCalendar>(
    (
        {
            value,
            onValueChange,
            nextInputRef,
            wrapperClassName,
            inputClassName,
            containerClassName,
            calendarClassName,
            imgClassName,
            name,
            ...restInputProps
        },
        inputRef
    ) => {
        const innerInputRef = useRef<HTMLInputElement>(null);

        const [isOpen, setOpen] = useState<boolean>(false);
        const [inputValue, setInputValue] = useState<string>("");

        const prevInputValue = useRef<string>("");

        useEffect(() => {
            prevInputValue.current = inputValue;
        }, [inputValue]);

        const filteredValue = useMemo(
            () => filterInputDate(inputValue, prevInputValue.current),
            [inputValue, prevInputValue]
        );

        const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            
        }, [nextInputRef]);

        const onCalendarValueChange = (value: Date) => {
            const normalizedDate = value.toISOString().split("T")[0];
        };

        const onContainerClick = () => {
            innerInputRef.current?.focus();
        };

        return (
            <div className={cn(styles.inputWrapper, wrapperClassName)}>
                <div
                    onClick={onContainerClick}
                    className={cn(containerClassName, styles.inputContainer, {
                        [styles.focused]: isOpen,
                    })}
                >
                    <input
                        ref={setComponentRefs(innerInputRef, inputRef)}
                        name={name}
                        placeholder="Не задано"
                        value={filteredValue}
                        onChange={(e) => onInputChange(e)}
                        type="text"
                        maxLength={10}
                        className={cn(inputClassName, styles.input)}
                        {...restInputProps}
                    />
                    <img
                        className={imgClassName}
                        src={calendarIcon}
                        alt="calendar icon"
                        onClick={() => setOpen(!isOpen)}
                    />
                </div>
                {isOpen && (
                    <Calendar
                        onChange={(value: Date) => onCalendarValueChange(value)}
                        defaultValue={new Date()}
                        tileClassName={styles.tile}
                        className={cn(calendarClassName, styles.calendar, {
                            [styles.activeCalendar]: isOpen,
                        })}
                    />
                )}
            </div>
        );
    }
);

export default InputCalendar;
