import { memo } from "react";
import cn from "classnames";

import mockIcon from "@/shared/assets/icons/avatarMock.svg";
import IconComponent from "@/shared/ui/IconComponent/IconComponent";

import styles from "./Avatar.module.scss";

type AvatarSize = "SMALL" | "MEDIUM" | "LARGE";

interface AvatarProps {
    size?: AvatarSize;
    className?: string;
    icon?: string;
    alt?: string;
}

export const Avatar = memo((props: AvatarProps) => {
    const {
        className,
        size = "SMALL",
        alt,
        icon,
    } = props;
    return (
        <div className={cn(styles.wrapper, className)}>
            <IconComponent
                icon={icon || mockIcon}
                className={styles[size]}
                alt={alt}
            />
        </div>
    );
});
