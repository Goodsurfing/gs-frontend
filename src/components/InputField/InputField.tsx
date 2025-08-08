import cn from "classnames";
import React, { FC } from "react";

import styles from "./InputField.module.scss";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: string;
    text?: string;
    error?: string;
}

const InputField: FC<InputFieldProps> = ({
    type,
    text,
    value,
    defaultValue,
    onChange,
    error,
    ...rest
}) => (
    <div className={styles.box}>
        <input
            type={type}
            required
            onChange={onChange}
            value={value}
            defaultValue={defaultValue}
            name="main"
            {...rest}
        />
        <label
            htmlFor="main"
            className={cn({
                [styles.empty]: value || defaultValue,
            })}
        >
            {text}
        </label>
        {error && (<ErrorText text={error} />)}
    </div>
);

export default InputField;
