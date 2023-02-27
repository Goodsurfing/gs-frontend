import cn from "classnames";
import React, { FC } from "react";

import styles from "./Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    img?: string;
    description?: string;
}

const Input: FC<InputProps> = ({
    label,
    img,
    type,
    required = false,
    placeholder = "",
    value,
    id,
    defaultValue,
    onChange,
    className,
    description,
    children,
    ...rest
}) => {
    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.labelWrapper}>
                {img && (
                    <img className={styles.image} src={img} alt={`${img}`} />
                )}
                <label htmlFor={id} className={styles.label}>
                    {label}
                </label>
            </div>
            <input
                id={id}
                required={required}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                className={styles.input}
                type={type}
                placeholder={placeholder}
                {...rest}
            />
            {description && (
                <label className={styles.description}>{description}</label>
            )}
            {children}
        </div>
    );
};

export default Input;
