import cn from "classnames";
import React, {
    FC,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
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
import { useLocale } from "@/app/providers/LocaleProvider";

const DatePickerCalendar: FC<DatePickerCalendarProps> = ({
    value,
    onChange,
    wrapperClassName,
    inputClassName,
    calendarClassName,
    calendarWrapperClassName,
    min,
    max,
    inputDisabled = false,
    isScrollTo = false,
}) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const calendarRef = useRef<HTMLDivElement>(null);
    const elementRef = useRef<HTMLDivElement>(null);
    const { locale } = useLocale();
    const { t } = useTranslation();

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
        setShowPopup((prev) => {
            if (isScrollTo) calendarRef.current?.scrollIntoView({ behavior: "smooth" });
            return !prev;
        });
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
            <div className={cn(styles.inputWrapper, inputClassName)}>
                <input
                    readOnly
                    type="text"
                    value={inputValue}
                    placeholder={t("Не задано")}
                    onChange={onInputValueChange}
                    className={cn(styles.input, {
                        [styles.invalid]: !isValueDate,
                        [styles.disabled]: inputDisabled,
                    })}
                />
                <img className={styles.img} src={calendarIcon} alt="calendar" />
            </div>
            <div
                ref={calendarRef}
                className={cn(
                    styles.calendarWrapper,
                    { [styles.close]: !showPopup },
                    calendarWrapperClassName,
                )}
                onClick={(event) => { event.stopPropagation(); }}
            >
                {!inputDisabled && (
                    <CalendarComponent
                        locale={locale}
                        className={cn(calendarClassName, styles.calendar)}
                        value={inputValueDate || new Date()}
                        onChange={(date: Date) => {
                            handleChange(date);
                        }}
                        minDate={min}
                        maxDate={max}
                    />
                )}
            </div>
        </div>
    );
};

export default DatePickerCalendar;
