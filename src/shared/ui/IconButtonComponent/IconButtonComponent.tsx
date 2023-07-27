import cn from "classnames";
import { IconButton } from "@mui/material";
import { memo } from "react";

import styles from "./IconButtonComponent.module.scss";
import IconComponent from "../IconComponent/IconComponent";

type IconButtonSize = "small" | "medium" | "large";

interface IconButtonComponentProps {
    icon: string;
    className?: string;
    text?: string;
    size?: IconButtonSize;
    rounded?: boolean;
    disabled?: boolean;
    checked: boolean;
    onClick?: () => void;
}

const IconButtonComponent = memo(({
    className,
    text,
    icon,
    disabled,
    rounded = true,
    size = "medium",
    checked = false,
    onClick,
}: IconButtonComponentProps) => (
    <div className={styles.wrapper}>
        <IconButton
            disabled={disabled}
            onClick={onClick}
            size={size}
            disableFocusRipple
            className={cn(
                styles.btn,
                className,
                { [styles.checked]: checked },
                { [styles.rounded]: rounded },
            )}
        >
            <IconComponent className={cn(styles.icon, styles[size])} icon={icon} />
        </IconButton>
        <span className={styles.text}>{text}</span>
    </div>
));

export default IconButtonComponent;
