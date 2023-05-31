import cn from "classnames";
import { FC, ReactNode } from "react";

import styles from "./Checkbox.module.scss";

interface CheckboxProps {
    children?: ReactNode;
    isChecked: boolean;
    onChange: () => void;
}

export const Checkbox: FC<CheckboxProps> = ({ children, isChecked, onChange }) => (
    <div className={styles.wrapper}>
        <label htmlFor="main">
            <input
                name="main"
                type="checkbox"
                checked={isChecked}
                onChange={onChange}
                className={cn(styles.checkbox, {
                  [styles.checked]: isChecked,
                })}
            />
            <span>{children}</span>
        </label>
    </div>
);
