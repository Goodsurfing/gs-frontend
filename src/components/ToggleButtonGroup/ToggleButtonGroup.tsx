import { ToggleButtonGroup } from "@mui/material";
import React, { FC, useState } from "react";

import { ToggleButtonGroupComponentProps } from "./types";

const ToggleButtonGroupComponent: FC<ToggleButtonGroupComponentProps> = ({
    onChange = () => {},
    defaultValue = "",
    children,
}) => {
    const [selectedItems, setSelectedItems] = useState(() => [defaultValue]);

    const onBtnToggleChange = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        newItems: string[]
    ) => {
        if (newItems.length) {
            setSelectedItems(newItems);
        }
        onChange(event, newItems);
    };

    return <ToggleButtonGroup value={selectedItems} onChange={onBtnToggleChange}>{children}</ToggleButtonGroup>;
};

export default ToggleButtonGroupComponent;
