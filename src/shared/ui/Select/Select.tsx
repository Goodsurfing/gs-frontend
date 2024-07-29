import cn from "classnames";
import { Select, SelectProps as MuiSelectProps } from "@mui/material";

import styles from "./Select.module.scss";

type SelectProps = MuiSelectProps & {
    label?: string;
};

export const SelectComponent = (props: SelectProps) => {
    const {
        children, label, className, id, disabled, ...restSelectProps
    } = props;
    return (
        <div className={styles.wrapper}>
            {label && (
                <label className={styles.label} htmlFor={id}>{label}</label>
            )}
            <Select
                variant="outlined"
                classes={{
                    outlined: styles.select,
                    nativeInput: styles.input,
                    select: styles.select,
                }}
                disabled={disabled}
                className={cn(className, styles.select, { [styles.disabled]: disabled })}
                {...restSelectProps}
            >
                {children}
            </Select>
        </div>
    );
};
