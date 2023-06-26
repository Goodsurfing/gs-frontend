import { ToggleButtonProps as ToggleBtnProps } from "@mui/material/ToggleButton";

export interface ToggleButtonProps extends ToggleBtnProps {
    checkedClassName?: string;
    notCheckedClassName?: string;
}
