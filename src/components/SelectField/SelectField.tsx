import cn from "classnames";
import React, { FC, useRef } from "react";
import Select, { GroupBase, Props } from "react-select";

import { IOption } from "@/types/select";

import "./SelectField.scss";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

interface Group extends GroupBase<IOption> {}

interface SelectFieldProps extends Props<IOption, boolean, Group> {
    options: IOption[];
    label: string;
    text?: string;
}

const SelectField: FC<SelectFieldProps> = ({ text, isDisabled, ...rest }) => {
    const dropdownRef = useRef(null);

    const handleClickOutside = () => {
        setOpened(false);
    };

    const handleDropdownClick = (e: React.MouseEvent, value: string) => {
        e.stopPropagation();
        if (value === selectedValue) {
            setOpened(false);
            return;
        }
        setSelectedValue(value);
        setOpened(false);
    };

    useOnClickOutside(dropdownRef, handleClickOutside);

    return (
        <div className="wrapper">
            <Select
                {...rest}
                ref={dropdownRef}
                isDisabled={isDisabled}
                unstyled
                className={cn("react-select-container", {
                    "select-disabled": isDisabled,
                })}
                classNamePrefix="react-select"
                name="main"
            />
            <label htmlFor="main">{text}</label>
        </div>
    );
};

export default SelectField;
