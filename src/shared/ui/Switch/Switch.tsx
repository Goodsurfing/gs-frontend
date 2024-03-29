import React, { FC } from "react";
import Switch, { SwitchProps } from "@mui/material/Switch";

interface ISwitch extends SwitchProps {}

const SwitchComponent: FC<ISwitch> = ({ ...restSwitchProps }) => (
    <Switch {...restSwitchProps} />
);

export default SwitchComponent;
