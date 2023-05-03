import { ButtonBaseProps, SxProps } from "@mui/material";

export interface CloseButtonProps extends ButtonWithSx {
  width?: number | string;
  height?: number | string;
} 

export interface ButtonWithSx extends ButtonBaseProps  {
  sx?: SxProps;
}