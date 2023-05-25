import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { unstable_styleFunctionSx as styleFunctionSx } from "@mui/system";
import React, { FC } from "react";

import DateInput from "../DateInput/DateInput";
import styles from "./DateInputs.module.scss";
import { DateInputsProps } from "./type";

const DateInputs: FC<DateInputsProps> = ({
  close,
  min,
  max,
  ...restBoxProps
}) => (
    <Box
        {...restBoxProps}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
    >
        <DateInput className={styles.leftInput} />
        <DateInput className={styles.rightInput} />
        {close}
    </Box>
);

export default styled(DateInputs)(styleFunctionSx);
