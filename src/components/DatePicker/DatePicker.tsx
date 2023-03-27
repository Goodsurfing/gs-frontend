import React, { FC } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { IDateOfBirthFormGroup } from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm.interface";

interface DatePickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    CustomInputElement?: React.ReactNode;
    isLocked: boolean;
    className?: string;
    data: IDateOfBirthFormGroup;
}

const DatePicker: FC<DatePickerProps> = ({
    value=new Date,
    onChange,
    className,
    CustomInputElement,
    isLocked,
    data,
}) => {
    return (
        <ReactDatePicker
            disabled={isLocked}
            selected={value || data.birthDate}
            onChange={(date) => onChange(date)}
            customInput={CustomInputElement}
            dateFormat="dd.MM.yyyy"
            className={className}
            showYearDropdown
        />
    );
};

export default DatePicker;
