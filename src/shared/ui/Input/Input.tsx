import cn from "classnames";
import React from "react";

import styles from "./Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    img?: string;
    description?: string;
    isDirty?: boolean;
    isValid?: boolean;
    id?: string;
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
              name={name}
              ref={inputRef}
              id={id}
              required={required}
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
              className={styles.input}
              type={type}
              placeholder={placeholder}
              {...restInputProps}
          />
          {description && (
          <label className={styles.description}>{description}</label>
          )}
          {children}
      </div>
  ),
);

export default Input;
