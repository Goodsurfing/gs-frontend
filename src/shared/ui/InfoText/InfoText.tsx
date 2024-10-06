import React, { FC, ReactNode } from "react";
import cn from "classnames";
import styles from "./InfoText.module.scss";

interface InfoTextProps {
    className?: string;
    children?: ReactNode
}
export const InfoText: FC<InfoTextProps> = (props) => {
    const { className, children } = props;
    return (
        <span className={cn(styles.wrapper, className)}>{children}</span>
    );
};
