import cn from "classnames";
import React, { FC } from "react";

import styles from "./Input.module.scss";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    img?: string;
    description?: string;
    id: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
        label,
        img,
        type,
        name,
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
    }, inputRef ) => {
        return (
            <div className={cn(styles.wrapper, className)}>
                <div className={styles.labelWrapper}>
                    {img && (
                        <img
                            className={styles.image}
                            src={img}
                            alt={`${img}`}
                        />
                    )}
                    <label htmlFor={id} className={styles.label}>
                        {label}
                    </label>
                </div>
                <input
                    ref={inputRef}
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
    }
);

export default Input;
