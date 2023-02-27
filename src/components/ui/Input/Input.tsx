import cn from "classnames";
import React, { FC } from "react";

import logoIcon from "@/assets/icons/navbar/home.svg";

import styles from "./Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    img?: string;
}

const Input: FC<InputProps> = ({
    label,
    img,
    type,
    required = false,
    placeholder = "",
    value,
    defaultValue,
    onChange,
    className,
    children,
    ...rest
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
                required={required}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                className={styles.input}
                type={type}
                placeholder={placeholder}
                {...rest}
            />
            {children}
        </div>
    );
};

export default Input;
