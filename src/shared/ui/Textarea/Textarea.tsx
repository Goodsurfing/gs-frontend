import cn from "classnames";
import React, { FC, useId } from "react";

import styles from "./Textarea.module.scss";

export interface IText extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    img?: string;
    label: string;
    description?: string;
    extraDescription?: string;
    classNameTextarea?: string;
    isError?: boolean;
}

const Textarea: FC<IText> = ({
    img,
    label,
    extraDescription,
    description,
    children,
    placeholder,
    className,
    classNameTextarea,
    required,
    maxLength,
    id,
    name,
    isError = false,
    ...restTextAreaProps
}) => {
    // Без id метка не связана с полем — для экранных читалок и тестов поле безымянное
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
        <div className={cn(styles.texarea, className)}>
            <div className={styles.labelWrapper}>
                {img && (
                    <img className={styles.image} src={img} alt={img} />
                )}
                <label className={styles.label} htmlFor={fieldId}>
                    {label}
                </label>
            </div>
            <textarea
                className={cn(styles.textarea, classNameTextarea, { [styles.error]: isError })}
                required={required}
                placeholder={placeholder}
                name={name}
                id={fieldId}
                maxLength={maxLength}
                {...restTextAreaProps}
            />
            {description && (
                <label htmlFor={fieldId} className={styles.description}>{description}</label>
            )}
            <br />
            {extraDescription && (
                <label htmlFor={fieldId} className={styles.description}>{extraDescription}</label>
            )}
            {children}
        </div>
    );
};

export default React.memo(Textarea);
