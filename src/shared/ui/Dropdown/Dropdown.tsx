import cn from "classnames";
import React, { FC, useRef, useState } from "react";

import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import dropdownIcon from "@/shared/assets/icons/dropdown.svg";

import styles from "./Dropdown.module.scss";
import { IDropdownProps } from "./Dropdown.types";

const Dropdown: FC<IDropdownProps> = ({
    options,
    label,
    description,
    className,
    onChange,
    icon = dropdownIcon,
    img,
}) => {
    const [opened, setOpened] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>(
        options[0],
    );

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
        <div
            onClick={() => { return setOpened(!opened); }}
            className={cn(styles.wrapper, className)}
        >
            <div className={styles.labelWrapper}>
                {img && (
                    <img className={styles.image} src={img} alt={`${img}`} />
                )}
                <label className={styles.label}>{label}</label>
            </div>

            <div ref={dropdownRef} className={styles.dropdownContainer}>
                <ul
                    className={cn(styles.dropdown, {
                        [styles.opened]: opened === true,
                        [styles.closed]: opened === false,
                    })}
                >
                    {options.map((dropdownItem, index) => {
                        return (
                            <li
                                key={index}
                                onClick={(e) => { return handleDropdownClick(e, options[index]); }}
                                className={styles.dropdownItem}
                            >
                                {dropdownItem}
                            </li>
                        );
                    })}
                </ul>
                {selectedValue}
                <img className={styles.arrow} src={icon} />
            </div>

            {description && (
                <label className={styles.description}>{description}</label>
            )}
        </div>
    );
};

export default Dropdown;
