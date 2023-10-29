import React, { FC, memo } from "react";
import cn from "classnames";

import styles from "./IconTextComponent.module.scss";
import IconComponent from "../IconComponent/IconComponent";

interface IconTextComponentProps {
    className?:string;
    icon:string;
    text:string;
    alt?:string;
}

export const IconTextComponent:FC<IconTextComponentProps> = memo((props:IconTextComponentProps) => {
    const {
        className, text, icon, alt,
    } = props;
    return (
        <div className={styles.container}>
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
});
