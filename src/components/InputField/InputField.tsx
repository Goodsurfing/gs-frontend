import cn from "classnames";
import React, { FC } from "react";

import styles from "./InputField.module.scss";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: string;
    text: string;
}

const InputField: FC<InputFieldProps> = ({
    type,
    text,
    value,
    defaultValue,
    onChange,
    ...rest
}) => {
    return (
        <div className={styles.box}>
            <input
                type={type}
                required={true}
                onChange={onChange}
                value={value}
                defaultValue={defaultValue}
                {...rest}
            />
            <label
                className={cn({
                    [styles.empty]: !!value || !!defaultValue,
                })}
            >
                {text}
            </label>
        </div>
    );
};

export default InputField;
