import { ButtonBaseProps, SxProps } from "@mui/material";

export interface IDateCloseButton extends ButtonWithSx {
  width?: number | string;
  height?: number | string;
} 

export interface ButtonWithSx extends ButtonBaseProps  {
  sx?: SxProps;
}