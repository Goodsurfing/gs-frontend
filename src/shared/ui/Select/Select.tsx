import { Select, SelectProps } from "@mui/material";

import styles from "./Select.module.scss";

interface SelectComponentProps extends SelectProps {}

export const SelectComponent = ({ children, ...restSelectProps }: SelectComponentProps) => (
    <Select className={styles.select} {...restSelectProps}>{children}</Select>
);
