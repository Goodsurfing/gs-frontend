import cn from "classnames";
import React, { FC, useState } from "react";

import styles from "./InputField.module.scss";

interface InputFieldProps {
    type: string;
    placeholder: string;
}

const InputField: FC<InputFieldProps> = ({ type, placeholder }) => {
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
            />
            <label
                className={cn({
                    [styles.empty]: !!value,
                })}
            >
                {placeholder}
            </label>
        </div>
    );
};

export default InputField;
