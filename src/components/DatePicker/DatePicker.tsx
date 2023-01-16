import React, { FC, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import InputField from "../InputField/InputField";

interface DatePickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    CustomInputElement?: React.ReactNode;
}

const DatePicker: FC<DatePickerProps> = ({
    value,
    onChange,
    CustomInputElement,
}) => {
    return (
        <ReactDatePicker
            selected={value}
            onChange={(date) => onChange(date)}
            customInput={CustomInputElement}
            dateFormat="dd.MM.yyyy"
            showYearDropdown={true}
        />
    );
};

export default DatePicker;
