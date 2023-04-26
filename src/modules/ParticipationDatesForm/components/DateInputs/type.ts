import { ReactNode } from "react";
import DateInput from "../DateInput/DateInput";
import { BoxProps, SxProps } from "@mui/material";

export interface DateInputsProps extends DateInputsWithSx {
  close: ReactNode;
  min?: Date;
  max?: Date;
}

interface DateInputsWithSx extends BoxProps {
  sx?: SxProps;
}