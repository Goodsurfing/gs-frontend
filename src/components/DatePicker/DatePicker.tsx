import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import InputField from "../InputField/InputField";

const DatePicker = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    return (
        <ReactDatePicker
            selected={selectedDate}
            onChange={(date: Date) => { return setSelectedDate(date); }}
            customInput={<InputField type="text" />}
            dateFormat="dd/MM/yyyy"
        />
    );
};

export default DatePicker;
