import React, { FC } from "react";
import Select, { GroupBase, Props } from "react-select";

interface IOption {
    value: string;
    label: string;
}

interface Group extends GroupBase<IOption> {}

interface SelectFieldProps extends Props<IOption, boolean, Group> {
    options: IOption[];
}

const SelectField: FC<SelectFieldProps> = (props) => {
    return (
        <div style={{ backgroundColor: "red" }}>
            <Select {...props} />
        </div>
    );
};

export default SelectField;
