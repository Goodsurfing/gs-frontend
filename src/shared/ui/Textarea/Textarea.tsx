import cn from "classnames";
import React, { FC } from "react";

import styles from "./Textarea.module.scss";

interface IText extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    img?: string;
    label: string;
    description?: string;
}

const Textarea: FC<IText> = ({
  img,
  label,
  description,
  children,
  placeholder,
  className,
  required,
  maxLength = 1000,
  id,
  name,
  ...restTextAreaProps
}) => {
  const handleTextAreaChange = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  return (
      <div className={cn(styles.texarea, className)}>
          <div className={styles.labelWrapper}>
              {img && (
              <img className={styles.image} src={img} alt={`${img}`} />
              )}
              <label className={styles.label} htmlFor={id}>
                  {label}
              </label>
          </div>
          <textarea
              onKeyDown={(e) => handleTextAreaChange(e)}
              className={styles.textarea}
              required={required}
              placeholder={placeholder}
              name={name}
              id={id}
              maxLength={maxLength}
              {...restTextAreaProps}
          />
          {description && (
          <label className={styles.description}>{description}</label>
          )}
          {children}
      </div>
  );
};

export default React.memo(Textarea);
