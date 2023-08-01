import { Select, SelectProps } from "@mui/material";

import styles from "./Select.module.scss";

interface SelectComponentProps extends SelectProps {}

export const SelectComponent = (props: SelectComponentProps) => {
    const { children, ...restSelectProps } = props;
    return (
        <div className={styles.wrapper}>
            <Select className={styles.select} {...restSelectProps}>
                {children}
            </Select>
        </div>
    );
};
