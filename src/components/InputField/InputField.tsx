import cn from "classnames";
import React, { FC, useState } from "react";

import styles from "./InputField.module.scss";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: string;
    text: string;
}

const InputField: FC<InputFieldProps> = ({ type, text, ...rest }) => {
    const [value, setValue] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return (
        <div className={styles.box}>
            <input
                type={type}
                required={true}
                onChange={handleChange}
                value={value}
                {...rest}
            />
            <label
                className={cn({
                    [styles.empty]: !!value,
                })}
            >
                {text}
            </label>
        </div>
    );
};

export default InputField;
