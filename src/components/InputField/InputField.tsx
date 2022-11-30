import React, { FC } from "react";

import styles from "./InputField.module.scss";

interface InputFieldProps {}

const InputField: FC<InputFieldProps> = (props) => {
    return (
        <div className={styles.box}>
            <input type="text" />
            <label>Имя</label>
        </div>
    );
};

export default InputField;
