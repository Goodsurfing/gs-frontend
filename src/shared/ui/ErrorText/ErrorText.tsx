import React, { FC } from "react";
import cn from "classnames";
import styles from "./ErrorText.module.scss";

interface ErrorTextProps {
    text?: string;
    className?: string;
}

export const ErrorText: FC<ErrorTextProps> = (props) => {
    const { text, className } = props;
    return (
        <p className={cn(styles.error, className)}>{text}</p>
    );
};
