import { SxProps, ToggleButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC, useState } from "react";

import styles from "./ToggleButtonComponent.module.scss";
import { ToggleButtonProps } from "./types";

interface StyledToggleButtonProps extends ToggleButtonProps {
    backgroundcolor?: string;
    activebackgroundcolor?: string;
    sx?: SxProps;
}

const StyledToggleButton = styled(ToggleButton)<StyledToggleButtonProps>(
    ({ theme, backgroundcolor, activebackgroundcolor }) => ({
        backgroundColor: backgroundcolor ?? "white",
        "&.Mui-selected": {
            backgroundColor:
                activebackgroundcolor ?? theme.palette.primary.main,
        },
    })
);

export const ToggleButtonComponent: FC<StyledToggleButtonProps> = ({
    value,
    className,
    checkedClassName,
    notCheckedClassName,
    onChange = () => {},
    children,
    backgroundcolor,
    color,
    activebackgroundcolor,
    sx,
    ...restToggleButtonProps
}) => {
    const [checked, setChecked] = useState(false);

    const onBtnToggle = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        value: any
    ) => {
        setChecked(!checked);
        onChange(event, value);
    };

    return (
        <StyledToggleButton
            value={value}
            onChange={onBtnToggle}
            backgroundcolor={backgroundcolor}
            activebackgroundcolor={activebackgroundcolor}
            sx={sx}
            {...restToggleButtonProps}
        >
            {children}
        </StyledToggleButton>
    );
};
