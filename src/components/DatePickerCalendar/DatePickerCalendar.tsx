import cn from "classnames";
import React, {
    FC,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import CalendarComponent from "@/shared/ui/CalendarComponent/CalendarComponent";

import calendarIcon from "@/shared/assets/icons/calendar.svg";

import styles from "./DatePickerCalendar.module.scss";
import { DatePickerCalendarProps } from "./type";
import { useLatest } from "./useLatest";
import {
    getDateFromInputValue,
    getInputValueFromDate,
    isInRange,
} from "./utils";

const DatePickerCalendar: FC<DatePickerCalendarProps> = ({
    value,
    onChange,
    wrapperClassName,
    inputClassName,
    calendarClassName,
    min,
    max,
    inputDisabled = true,
}) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const elementRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        setInputValue(getInputValueFromDate(value));
    }, [value]);

    const updateValueOnPopupClose = () => {
        const date = getDateFromInputValue(inputValue);

        setShowPopup(false);

        if (!date) {
            setInputValue(getInputValueFromDate(value));
            return;
        }

        const isDateInRange = isInRange(date, min, max);

        if (!isDateInRange) {
            return;
        }

        onChange(date);
    };

    const latestUpdateValueFromInput = useLatest(updateValueOnPopupClose);

    useEffect(() => {
        const element = elementRef.current;

        if (!element) {
            return;
        }

        const onDocumentClick = (e: MouseEvent) => {
            const { target } = e;

            if (!(target instanceof Node)) {
                return;
            }

            if (element.contains(target)) {
                return;
            }

            setShowPopup(false);
        };

        document.addEventListener("click", onDocumentClick);

        return () => {
            document.removeEventListener("click", onDocumentClick);
        };
    }, [latestUpdateValueFromInput]);

    const handleChange = (val: Date) => {
        onChange(val);
        setShowPopup(false);
    };

    const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value.trim());
    };

    const onInputClick = () => {
        setShowPopup(true);
    };

    const [inputValueDate, isValueDate] = useMemo(() => {
        const date = getDateFromInputValue(inputValue);

        if (!date) {
            return [undefined, false];
        }

        const isDateInRange = isInRange(date, min, max);

        return [date, isDateInRange];
    }, [inputValue, min, max]);

    return (
        <div
            onClick={onInputClick}
            className={cn(wrapperClassName, styles.wrapper)}
            ref={elementRef}
        >
            <input
                disabled={inputDisabled}
                type="text"
                value={inputValue}
                onChange={onInputValueChange}
                className={cn(inputClassName, styles.input, {
                    [styles.invalid]: !isValueDate,
                })}
            />
            <img className={styles.img} src={calendarIcon} alt="calendar" />
            {showPopup && inputValueDate && (
                <CalendarComponent
                    className={cn(calendarClassName, styles.calendar)}
                    value={inputValueDate}
                    onChange={(date: Date) => {
                        handleChange(date);
                    }}
                    minDate={min}
                    maxDate={max}
                />
            )}
        </div>
    );
};

export default DatePickerCalendar;
