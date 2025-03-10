import { IconButton } from "@mui/material";
import cn from "classnames";
import React, {
    FC, useCallback, useMemo, useRef, useState,
} from "react";
import { ReactSVG } from "react-svg";
import Popup from "@/components/Popup/Popup";

import threeDotsIcon from "@/shared/assets/icons/three-dots.svg";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import { filterData } from "../../data/filter.data";
import styles from "./UserListFilter.module.scss";
import { FormApplicationStatus } from "@/entities/Application";

interface UserListFilterProps {
    filterValue: FormApplicationStatus | null
    onChange?: (value: any) => void;
}

export const UserListFilter: FC<UserListFilterProps> = (props) => {
    const { filterValue, onChange } = props;
    // const [filterValue, setFilterValue] = useState<FilterValue>(null);
    const [isDropdownOpened, setDropdownOpened] = useState<boolean>(false);
    const buttonRef = useRef(null);

    useOnClickOutside(buttonRef, () => setDropdownOpened(false));

    const handleOpenDropdown = () => {
        setDropdownOpened((prev) => !prev);
    };

    const selectFilter = useCallback(
        (value: FormApplicationStatus | null) => {
            if (value === filterValue) {
                // setFilterValue(null);
                onChange?.(null);
            } else {
                // setFilterValue(value);
                onChange?.(value);
            }
            setDropdownOpened(false);
        },
        [filterValue, onChange],
    );

    const renderFilterItems = useMemo(
        () => filterData.map((item) => (
            <div
                key={item.value}
                className={cn(styles.item, {
                    [styles.active]: item.value === filterValue,
                })}
                onClick={() => selectFilter(item.value)}
            >
                <div
                    className={styles.dot}
                    style={{ backgroundColor: item.color }}
                />
                <span className={styles.text}>{item.text}</span>
            </div>
        )),
        [filterValue, selectFilter],
    );

    return (
        <div className={styles.wrapper} ref={buttonRef}>
            <IconButton className={styles.button} onClick={handleOpenDropdown}>
                <ReactSVG src={threeDotsIcon} className={styles.buttonIcon} />
            </IconButton>
            <Popup className={styles.popup} isOpen={isDropdownOpened}>
                <div className={styles.container} ref={buttonRef}>{renderFilterItems}</div>
            </Popup>
        </div>
    );
};
