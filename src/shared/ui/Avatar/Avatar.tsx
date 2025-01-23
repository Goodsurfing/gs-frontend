import cn from "classnames";
import { memo } from "react";

import { sliceFirstLetter } from "@/shared/lib/sliceFirstLetter";

import styles from "./Avatar.module.scss";

type AvatarSize = "SMALL" | "MEDIUM" | "LARGE" | "DEFAULT";

interface AvatarProps {
    size?: AvatarSize;
    className?: string;
    icon?: string;
    alt?: string;
    color?: string;
    text?: string;
    onClick?: () => void;
}

export const Avatar = memo((props: AvatarProps) => {
    const {
        className,
        size = "DEFAULT",
        alt,
        icon,
        color = "#DFE6EB",
        text,
        onClick,
    } = props;

    return (
        <div className={cn(styles.wrapper, className)} onClick={onClick}>
            {icon && <img src={icon} alt={alt} className={styles[size]} />}
            {!icon
                && (text ? (
                    <div className={cn(styles.avatarNoImg, styles[size])}>
                        {sliceFirstLetter(text)}
                    </div>
                ) : (
                    <div
                        className={cn(styles.defaultPlaceholder, styles[size])}
                        style={{ backgroundColor: color }}
                    />
                ))}
        </div>
    );
});
