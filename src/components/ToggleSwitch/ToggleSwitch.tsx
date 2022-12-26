import React, { FC } from "react";

import styles from "./ToggleSwitch.module.scss";

interface ToggleSwitchProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    text?: string;
    label: string;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({ text, label, ...rest }) => {
    return (
        <div className={styles.box}>
            <div className={styles.wrapper}>
                <input name="main" type="radio" {...rest} />
                <span>{label}</span>
            </div>
            <label htmlFor="main">{text}</label>
        </div>
    );
};

export default ToggleSwitch;