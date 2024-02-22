import cn from "classnames";
import React, { FC } from "react";

import styles from "./Checkbox.module.scss";

interface CheckboxProps {
    text?: string;
    id?: string;
    isChecked: boolean;
    onChange: () => void;
}

const Checkbox: FC<CheckboxProps> = ({
    text, isChecked, onChange, id = "checkbox",
}) => (
    <div className={styles.wrapper}>
        <label htmlFor={id}>
            <input
                name="main"
                id={id}
                type="checkbox"
                checked={isChecked}
                onChange={onChange}
                className={cn(styles.checkbox, {
                    [styles.checked]: isChecked,
                })}
            />
            <span>{text}</span>
        </label>
    </div>
);

export default Checkbox;
