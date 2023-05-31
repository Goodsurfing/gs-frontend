import { BoxProps, SxProps } from "@mui/material";
import { ReactNode } from "react";

interface DateInputsWithSx extends BoxProps {
  sx?: SxProps;
}

export interface DateInputsProps extends DateInputsWithSx {
  close: ReactNode;
  min?: Date;
  max?: Date;
}
