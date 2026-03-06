import React, { FC } from "react";
import cn from "classnames";
import SelectField from "@/components/SelectField/SelectField";

import { DonationSort, useSortDonations } from "@/entities/Donation";
import styles from "./SelectSort.module.scss";

interface SelectSortProps {
    value: any;
    onChange: (value: any) => void;
    classNameDropdown?: string;
    className?: string;
    classNameControl?: string;
    classNameOption?: string;
}

export const SelectSort: FC<SelectSortProps> = (props) => {
    const {
        value, onChange, className, classNameControl, classNameDropdown,
        classNameOption,
    } = props;
    const sortDonations = useSortDonations();

    const findValueSort = (valueSort: DonationSort) => sortDonations
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
                classNameOption={cn(classNameOption, styles.option)}
                options={sortDonations}
                value={findValueSort(value)}
                onChange={handleSortChange}
            />
        </div>
    );
};
