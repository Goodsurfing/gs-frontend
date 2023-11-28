import cn from "classnames";
import { memo } from "react";

import styles from "./Avatar.module.scss";

type AvatarSize = "SMALL" | "MEDIUM" | "LARGE" | "DEFAULT";

interface AvatarProps {
    size?: AvatarSize;
    className?: string;
    icon?: string;
    alt?: string;
    color?: string;
}

export const Avatar = memo((props: AvatarProps) => {
    const {
        className, size = "DEFAULT", alt, icon, color,
    } = props;

    return (
        <div className={cn(styles.wrapper, className)}>
            {icon ? (
                <img src={icon} alt={alt} className={styles[size]} />
            ) : (
                <div className={styles.defaultPlaceholder} style={{ backgroundColor: color }} />
            )}
        </div>
    );
});
