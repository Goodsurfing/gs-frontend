import cn from "classnames";
import React, { FC } from "react";
import Select, { GroupBase, Props } from "react-select";
import { IOption } from "@/types/select";

import "./SelectField.scss";

interface Group extends GroupBase<IOption> {}

interface SelectFieldProps extends Props<IOption, boolean, Group> {
    options: IOption[];
    text?: string;
}

const SelectField: FC<SelectFieldProps> = ({ text, isDisabled, ...rest }) => {
    return (
        <div className="wrapper">
            <Select
                {...rest}
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
