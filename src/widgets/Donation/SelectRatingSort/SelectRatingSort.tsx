import React, { FC } from "react";
import cn from "classnames";
import SelectField from "@/components/SelectField/SelectField";

import { DonationRatingSort, useSortRatingDonations } from "@/entities/Donation";
import styles from "./SelectRatingSort.module.scss";

interface SelectRatingSortProps {
    value: any;
    onChange: (value: any) => void;
    classNameDropdown?: string;
    className?: string;
    classNameControl?: string;
    classNameOption?: string;
}

export const SelectRatingSort: FC<SelectRatingSortProps> = (props) => {
    const {
        value, onChange, className, classNameControl, classNameDropdown,
        classNameOption,
    } = props;
    const sortDonations = useSortRatingDonations();

    const findValueSort = (valueSort: DonationRatingSort) => sortDonations
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
