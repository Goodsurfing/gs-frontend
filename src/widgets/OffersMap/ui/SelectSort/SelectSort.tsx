import React, { FC } from "react";
import cn from "classnames";
import SelectField from "@/components/SelectField/SelectField";

import { SortValue } from "@/entities/Offer";

import { useSortOffers } from "../../model/sortOffers.data";
import styles from "./SelectSort.module.scss";

interface SelectSortProps {
    value: any;
    onChange: (value: any) => void;
    classNameDropdown?: string;
    className?: string;
    classNameControl?: string;
}

export const SelectSort: FC<SelectSortProps> = (props) => {
    const {
        value, onChange, className, classNameControl, classNameDropdown,
    } = props;
    const sortOffers = useSortOffers();

    const findValueSort = (valueSort: SortValue) => sortOffers
        .find((option) => option.value === valueSort);

    const handleSortChange = (valueSort: any) => {
        onChange(valueSort.value);
    };

    return (
        <div className={styles.wrapper}>
            <SelectField
                isSearchable={false}
                name="sort"
                className={cn(styles.sort, className)}
                classNameDropdown={cn(styles.dropdown, classNameDropdown)}
                classNameControl={cn(styles.control, classNameControl)}
                options={sortOffers}
                value={findValueSort(value)}
                onChange={handleSortChange}
            />
        </div>
    );
};
