import React, { FC } from "react";
import SelectField from "@/components/SelectField/SelectField";

import { sortOffers } from "../../model/sortOffers.data";
import styles from "./SelectSort.module.scss";

interface SelectSortProps {
    value: any;
    onChange: (value: any) => void;
}

export const SelectSort: FC<SelectSortProps> = (props) => {
    const { value, onChange } = props;
    return (
        <div className={styles.wrapper}>
            <SelectField
                className={styles.sort}
                classNameDropdown={styles.dropdown}
                classNameControl={styles.control}
                name="sort"
                // label="Знание языков"
                options={sortOffers}
                value={value}
            />
        </div>
    );
};
