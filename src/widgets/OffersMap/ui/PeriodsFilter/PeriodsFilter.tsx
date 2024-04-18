import React, { FC } from "react";
import styles from "./PeriodsFilter.module.scss";

interface PeriodsFilterProps {
    value: any;
    onChange: (value: any) => void
}

export const PeriodsFilter: FC<PeriodsFilterProps> = (props) => {
    const { value, onChange } = props;
    return (
        <div className={styles.wrapper}>PeriodsFilter</div>
    );
};
