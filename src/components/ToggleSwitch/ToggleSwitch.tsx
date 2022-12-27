import React, { FC, useState } from "react";
import cn from "classnames";
import styles from "./ToggleSwitch.module.scss";

interface ToggleSwitchProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({ label, onChange, ...rest }) => {
    const [switchState, setSwitchState] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.checked);
        setSwitchState(!switchState);
        if (event && onChange) {
            onChange(event);
        }
    };

    return (
        <div className={styles.box}>
            <label
                htmlFor="checkbox"
                className={cn(styles.wrapper, {
                    [styles.checked]: switchState,
                })}
            >
                <input
                    checked={switchState}
                    type="checkbox"
                    id="checkbox"
                    onChange={(e) => { return handleChange(e); }}
                    {...rest}
                />
            </label>
            <span>{label}</span>
        </div>
    );
};

export default ToggleSwitch;
