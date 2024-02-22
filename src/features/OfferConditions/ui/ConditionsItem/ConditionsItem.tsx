import { memo } from "react";
import { ToggleButtonWithIcon } from "@/shared/ui/ToggleButtonWithIcon/ToggleButtonWithIcon";

import styles from "./ConditionsItem.module.scss";

interface ConditionsItemProps {
    icon: string;
    text: string;
    checked: boolean;
    onToggle: () => void;
}

export const ConditionsItem = memo(({
    icon,
    text,
    checked,
    onToggle,
}: ConditionsItemProps) => (
    <ToggleButtonWithIcon
        className={styles.toggleButton}
        activeClassName={styles.active}
        onToggle={onToggle}
        checked={checked}
        text={text}
        icon={icon}
    />
));
