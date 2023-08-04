import cn from "classnames";
import { Select, SelectProps } from "@mui/material";

import styles from "./Select.module.scss";

interface SelectComponentProps extends SelectProps {}

export const SelectComponent = (props: SelectComponentProps) => {
    const { children, className, ...restSelectProps } = props;
    return (
        <div className={styles.wrapper}>
            <Select
                variant="outlined"
                classes={{
                    outlined: styles.select,
                    nativeInput: styles.input,
                    select: styles.select,
                }}
                className={cn(className, styles.select)}
                {...restSelectProps}
            >
                {children}
            </Select>
        </div>
    );
};
