import React, { FC } from "react";
import cn from "classnames";
import SelectField from "@/components/SelectField/SelectField";

import { useSelectBannerType } from "../../lib/useSelectBannerType";
import { BannerMarketingType } from "@/entities/Admin";
import styles from "./SelectType.module.scss";

interface SelectTypeProps {
    value: any;
    onChange: (value: any) => void;
    classNameDropdown?: string;
    className?: string;
    classNameControl?: string;
    classNameOption?: string;
}

export const SelectType: FC<SelectTypeProps> = (props) => {
    const {
        value, onChange, className, classNameControl, classNameDropdown,
        classNameOption,
    } = props;
    const selectBannerTypes = useSelectBannerType();

    const findValueSelect = (valueSelect: BannerMarketingType) => selectBannerTypes
        .find((option) => option.value === valueSelect);

    const handleSelectChange = (valueSelect: any) => {
        onChange(valueSelect.value);
    };

    return (
        <SelectField
            isSearchable={false}
            name="sort"
            className={cn(styles.sort, className)}
            classNameDropdown={cn(styles.dropdown, classNameDropdown)}
            classNameControl={cn(styles.control, classNameControl)}
            classNameOption={cn(classNameOption, styles.option)}
            options={selectBannerTypes}
            value={findValueSelect(value)}
            onChange={handleSelectChange}
        />
    );
};
