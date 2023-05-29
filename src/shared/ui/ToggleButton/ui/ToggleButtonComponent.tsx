import { SxProps, ToggleButton, ToggleButtonProps as MuiToggleButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ToggleButtonProps as ToggleBtnProps } from "@mui/material/ToggleButton";
import React, { FC, useState } from "react";

export interface ToggleButtonProps extends ToggleBtnProps {
    checkedClassName?: string;
    notCheckedClassName?: string;
}

interface StyledToggleButtonProps extends Pick<MuiToggleButtonProps, "onChange" | "selected"> {
    btncolor?: string;
    sx?: SxProps;
}

const StyledToggleButton = styled(ToggleButton)<StyledToggleButtonProps>(
  ({ theme, btncolor }) => ({
    "&.Mui-selected": {
      backgroundColor: btncolor ?? theme.palette.primary.main,
    },
    "&.Mui-selected:hover": {
      backgroundColor: btncolor ?? theme.palette.primary.main,
    },
  }),
);

export const ToggleButtonComponent: FC<MuiToggleButtonProps & StyledToggleButtonProps> = ({
  value,
  onChange = () => {},
  btncolor,
  sx,
  children,
  ...restToggleButtonProps
}) => {
  const [checked, setChecked] = useState(false);

  const onBtnToggle = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    value: any,
  ) => {
    setChecked(!checked);
    onChange(event, value);
  };

  return (
      <StyledToggleButton
          value={value}
          onChange={onBtnToggle}
          btncolor={btncolor}
          sx={sx}
          {...restToggleButtonProps}
      >
          {children}
      </StyledToggleButton>
  );
};
