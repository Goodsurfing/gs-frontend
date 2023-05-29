import Switch, { SwitchProps } from "@mui/material/Switch";
import React, { FC } from "react";

interface ISwitch extends SwitchProps {}

export const SwitchComponent: FC<ISwitch> = ({ ...restSwitchProps }) => (
    <Switch {...restSwitchProps} />
);
