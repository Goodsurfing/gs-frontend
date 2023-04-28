import { SxProps, ToggleButtonGroupProps } from "@mui/material";

export interface ToggleButtonGroupComponentProps extends StyledToggleButtonGroupProps {}

export interface StyledToggleButtonGroupProps extends ToggleButtonGroupProps {
    sx?: SxProps;
}
