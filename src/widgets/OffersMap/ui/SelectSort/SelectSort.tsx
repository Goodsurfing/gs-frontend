import React, { FC } from "react";
import SelectField from "@/components/SelectField/SelectField";

import { SortValue } from "@/entities/Offer";

import { sortOffers } from "../../model/sortOffers.data";
import styles from "./SelectSort.module.scss";

interface SelectSortProps {
    value: any;
    onChange: (value: any) => void;
}

export const SelectSort: FC<SelectSortProps> = (props) => {
    const { value, onChange } = props;

    const findValueSort = (valueSort: SortValue) => sortOffers
        .find((option) => option.value === valueSort);

    const handleSortChange = (valueSort: any) => {
        onChange(valueSort.value);
    };

    return (
        <div className={styles.wrapper}>
            <SelectField
                name="sort"
                className={styles.sort}
                classNameDropdown={styles.dropdown}
                classNameControl={styles.control}
                options={sortOffers}
                value={findValueSort(value)}
                onChange={handleSortChange}
            />
        </div>
    );
};
