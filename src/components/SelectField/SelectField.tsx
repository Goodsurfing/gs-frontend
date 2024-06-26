import cn from "classnames";
import React, { FC } from "react";
import Select, { GroupBase, Props } from "react-select";

import styles from "./SelectField.module.scss";

interface Group extends GroupBase<unknown> {}

interface SelectFieldProps extends Props<unknown, boolean, Group> {
    options: unknown[];
    label?: string;
    name: string;
    img?: string;
    description?: string;
    classNameDropdown?: string;
    classNameControl?: string;
}

const SelectField: FC<SelectFieldProps> = ({
    isDisabled,
    name,
    img,
    description,
    label,
    className,
    placeholder = "",
    classNameDropdown,
    classNameControl,
    ...rest
}) => (
    <div className={cn(styles.wrapper, className)}>
        <div className={styles.labelWrapper}>
            {img && (
                <img className={styles.image} src={img} alt={img} />
            )}
            <label htmlFor={name} className={styles.label}>
                {label}
            </label>
        </div>
        <Select
            {...rest}
            placeholder={placeholder}
            isDisabled={isDisabled}
            className={cn(styles.dropdown, {
                [styles.disabled]: isDisabled,
            }, classNameDropdown)}
            classNames={{
                option: () => styles.option,
                input: () => styles.input,
                indicatorsContainer: () => styles.menuIndicator,
                menuList: () => styles.menuWrapper,
                menu: () => styles.menuList,
                control: (state) => (
                    state.isDisabled
                        ? cn(styles.control, classNameControl, styles.disabled)
                        : cn(styles.control, classNameControl)
                ),
            }}
            name={name}
            unstyled
        />
        {description && (
            <label className={styles.description}>{description}</label>
        )}
    </div>
);

export default SelectField;
