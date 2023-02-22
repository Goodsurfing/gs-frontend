import cn from "classnames";
import React, { FC, useRef, useState } from "react";

import logoIcon from "@/assets/icons/navbar/home.svg";

import styles from "./Input.module.scss";

export enum InputType {
    PASSWORD = "password",
    TEXT = "text",
}

interface InputProps {
    value: string;
    setInputValue: (value: string) => void;
    label: string | React.ReactNode;
    placeholder?: string;
    type: InputType;
    className?: string;
    img?: string;
}

const Input: FC<InputProps> = ({
    label,
    placeholder,
    type,
    img,
    setInputValue,
    value,
    className,
}) => {
    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.labelWrapper}>
                {img && (
                    <img
                        className={styles.image}
                        src={logoIcon}
                        alt={`${logoIcon}`}
                    />
                )}
                <label className={styles.label}>{label}</label>
            </div>
            <input
                value={value}
                onChange={(e) => setInputValue(e.target.value)}
                className={styles.input}
                type={type}
                placeholder={placeholder}
            />
        </div>
    );
};

export default Input;