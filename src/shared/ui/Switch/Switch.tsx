import React, { FC } from "react";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { styled } from "@mui/material";

interface ISwitch extends SwitchProps {}

const CustomSwitch = styled(Switch)({
    "&.MuiSwitch-root": {
        "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#fff",
        },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#3DABF7",
            opacity: 1,
        },
    },
});

const SwitchComponent: FC<ISwitch> = ({ ...restSwitchProps }) => (
    <CustomSwitch {...restSwitchProps} />
);

export default SwitchComponent;
