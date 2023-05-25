import { ReactNode } from "react";
import { BoxProps, SxProps } from "@mui/material";
import DateInput from "../DateInput/DateInput";

export interface DateInputsProps extends DateInputsWithSx {
  close: ReactNode;
  min?: Date;
  max?: Date;
}

interface DateInputsWithSx extends BoxProps {
  sx?: SxProps;
}
