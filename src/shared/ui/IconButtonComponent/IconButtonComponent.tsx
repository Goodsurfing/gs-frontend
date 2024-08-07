import cn from "classnames";
import { IconButton } from "@mui/material";
import { memo } from "react";

import styles from "./IconButtonComponent.module.scss";
import IconComponent from "../IconComponent/IconComponent";

type IconButtonSize = "small" | "medium" | "large";

interface IconButtonComponentProps {
    icon: string;
    className?: string;
    activeClassName?: string;
    wrapperClassName?: string;
    disabledClassName?: string;
    text?: string;
    size?: IconButtonSize;
    rounded?: boolean;
    disabled?: boolean;
    checked?: boolean;
    id?: string;
    onClick?: () => void;
}

const IconButtonComponent = memo(({
    className,
    activeClassName,
    wrapperClassName,
    disabledClassName,
    text,
    icon,
    disabled,
    id,
    rounded = true,
    size = "medium",
    checked = false,
    onClick,
}: IconButtonComponentProps) => (
    <div className={cn(wrapperClassName, styles.wrapper)}>
        <IconButton
            disabled={disabled}
            onClick={onClick}
            size={size}
            id={id}
            disableFocusRipple
            className={cn(
                styles.btn,
                className,
                { [cn(styles.checked, activeClassName)]: checked },
                { [styles.rounded]: rounded },
                { [cn(styles.disabled, disabledClassName)]: disabled },
            )}
        >
            <IconComponent className={cn(styles.icon, styles[size])} icon={icon} />
        </IconButton>
        {text && (
            <label
                onClick={onClick}
                htmlFor={id}
                className={styles.text}
            >
                {text}

            </label>
        )}
    </div>
));

export default IconButtonComponent;
