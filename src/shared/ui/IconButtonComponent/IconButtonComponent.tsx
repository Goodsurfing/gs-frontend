import cn from "classnames";
import { IconButton } from "@mui/material";
import { memo } from "react";

import styles from "./IconButtonComponent.module.scss";
import { Icon } from "../Icon/Icon";

interface IconButtonComponentProps {
    icon: string;
    className?: string;
    text?: string;
    checked: boolean;
    onClick: () => void;
}

export const IconButtonComponent = memo(({
    className,
    text,
    icon,
    checked,
    onClick,
}: IconButtonComponentProps) => (
    <div className={styles.wrapper}>
        <IconButton
            onClick={onClick}
            className={cn(styles.btn, className, { [styles.checked]: checked })}
        >
            <Icon icon={icon} />
        </IconButton>
        <span className={styles.text}>{text}</span>
    </div>
));
