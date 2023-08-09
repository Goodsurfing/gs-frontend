import { memo } from "react";
import { ToggleButtonWithIcon } from "@/shared/ui/ToggleButtonWithIcon/ToggleButtonWithIcon";

export type ConditionsItemIcon = "";

interface ConditionsItemProps {

}

export const ConditionsItem = memo(({}: ConditionsItemProps) => (
    <ToggleButtonWithIcon icon="" />
));
