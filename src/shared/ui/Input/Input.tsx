import cn from "classnames";
import React from "react";

import styles from "./Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    img?: string;
    description?: string;
    inputClassName?: string;
    isDirty?: boolean;
    isValid?: boolean;
    id?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
        label,
        img,
        type,
        inputClassName,
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
        ...restInputProps
    }, inputRef) => (
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
                value={value || ""}
                onChange={onChange}
                className={cn(styles.input, inputClassName)}
                type={type}
                placeholder={placeholder}
                {...restInputProps}
            />
            {description && (
                <label htmlFor={id} className={styles.description}>{description}</label>
            )}
            {children}
        </div>
    ),
);

export default Input;
