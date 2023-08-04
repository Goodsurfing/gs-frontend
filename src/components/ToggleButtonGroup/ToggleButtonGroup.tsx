import { ToggleButtonGroup } from "@mui/material";
import React, { FC, useState } from "react";

import { styled } from "@mui/material/styles";
import { ToggleButtonGroupComponentProps, StyledToggleButtonGroupProps } from "./types";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)<StyledToggleButtonGroupProps>(({ theme }) => ({}));

const ToggleButtonGroupComponent: FC<ToggleButtonGroupComponentProps> = ({
    onChange = () => {},
    sx,
    defaultValue = "",
    children,
}) => {
    const [selectedItems, setSelectedItems] = useState(() => [defaultValue]);

    const onBtnToggleChange = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        newItems: string[],
    ) => {
        if (newItems.length) {
            setSelectedItems(newItems);
        }
        onChange(event, newItems);
    };

    return <StyledToggleButtonGroup value={selectedItems} onChange={onBtnToggleChange} sx={sx}>{children}</StyledToggleButtonGroup>;
};

export default ToggleButtonGroupComponent;
