import cn from "classnames";
import React, { FC, memo } from "react";

import IconComponent from "../IconComponent/IconComponent";
import styles from "./IconTextComponent.module.scss";

interface IconTextComponentProps {
    className?: string;
    icon: string;
    text: string;
    alt?: string;
}

export const IconTextComponent: FC<IconTextComponentProps> = memo(
    (props: IconTextComponentProps) => {
        const {
            className, text, icon, alt,
        } = props;

        return (
            <div className={cn(styles.container, className)}>
                <div className={styles.iconWrapper}>
                    <IconComponent
                        className={styles.icon}
                        icon={icon}
                        alt={alt}
                    />
                </div>
                {text}
            </div>
        );
    },
);
