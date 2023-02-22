import React, { FC } from "react";

import styles from "./Input.module.scss";

export enum InputType {
    PASSWORD = "password",
    TEXT = "text"
}

interface InputProps {
    label: string | React.ReactNode;
    placeholder?: string;
    type: InputType;
}

const Input: FC<InputProps> = ({ label, placeholder }) => {
    return (
    <div className={styles.wrapper}>
        <span className={styles.label}>{label}</span>
        <input className={styles.input} type="text" placeholder={placeholder} />
    </div>
    );
};

export default Input;
