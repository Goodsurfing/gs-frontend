import cn from "classnames";
import React, { useId } from "react";

import styles from "./Input.module.scss";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    img?: string;
    description?: string;
    inputClassName?: string;
    isDirty?: boolean;
    isValid?: boolean;
    id?: string;
    isError?: boolean;
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
        isError = false,
        ...restInputProps
    }, inputRef) => {
        // Без id метка не связана с полем — для экранных читалок и тестов поле безымянное
        const generatedId = useId();
        const fieldId = id ?? generatedId;

        return (
            <div className={cn(styles.wrapper, className)}>
                {(label || img) && (
                    <div className={styles.labelWrapper}>
                        {img && (
                            <img
                                className={styles.image}
                                src={img}
                                alt={img}
                            />
                        )}
                        <label htmlFor={fieldId} className={styles.label}>
                            {label}
                        </label>
                    </div>
                )}
                <input
                    ref={inputRef}
                    id={fieldId}
                    required={required}
                    value={value || ""}
                    onChange={onChange}
                    className={cn(styles.input, inputClassName, { [styles.error]: isError })}
                    type={type}
                    placeholder={placeholder}
                    {...restInputProps}
                />
                {description && (
                    <label htmlFor={fieldId} className={styles.description}>{description}</label>
                )}
                {children}
            </div>
        );
    },
);

export default Input;
