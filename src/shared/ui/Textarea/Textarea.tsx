import cn from "classnames";
import React, { FC } from "react";

import styles from "./Textarea.module.scss";

export interface IText extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    img?: string;
    label: string;
    description?: string;
    extraDescription?: string;
    classNameTextarea?: string;
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
    maxLength = 1000,
    id,
    name,
    ...restTextAreaProps
}) => (
    <div className={cn(styles.texarea, className)}>
        <div className={styles.labelWrapper}>
            {img && (
                <img className={styles.image} src={img} alt={img} />
            )}
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
        </div>
        <textarea
            className={cn(styles.textarea, classNameTextarea)}
            required={required}
            placeholder={placeholder}
            name={name}
            id={id}
            maxLength={maxLength}
            {...restTextAreaProps}
        />
        {description && (
            <label htmlFor={id} className={styles.description}>{description}</label>
        )}
        <br />
        {extraDescription && (
            <label htmlFor={id} className={styles.description}>{extraDescription}</label>
        )}
        {children}
    </div>
);

export default React.memo(Textarea);
