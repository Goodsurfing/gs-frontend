import cn from "classnames";
import React, { FC, useState } from "react";

import styles from "./Checkbox.module.scss";

interface CheckboxProps {
    text: string;
}

const Checkbox: FC<CheckboxProps> = ({ text }) => {
    const [isChecked, setIsChecked] = useState<boolean>(false);

    return (
        <div className={styles.wrapper}>
            <label>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked((prev) => !prev)}
                    className={cn(styles.checkbox, {
                        [styles.checked]: isChecked,
                    })}
                />
                <span>{text}</span>
            </label>
        </div>
    );
};

export default Checkbox;
