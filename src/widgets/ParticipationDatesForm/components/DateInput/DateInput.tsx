import { Box } from "@mui/material";
import cn from "classnames";
import React, { FC, useState } from "react";

import DatePickerCalendar from "components/DatePickerCalendar/DatePickerCalendar";

import styles from "./DateInputs.module.scss";
import { IDateInput } from "./type";

const DateInput: FC<IDateInput> = ({ min, max, className }) => {
  const [date, setDate] = useState<Date>(new Date());

  return (
      <Box
          sx={{ display: "flex", alignItems: "center", position: "relative" }}
      >
          <DatePickerCalendar
              inputClassName={cn(styles.input, className)}
              onChange={setDate}
              min={min}
              max={max}
              value={date}
          />
      </Box>
  );
};

export default DateInput;
