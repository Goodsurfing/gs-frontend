import React, {
    FC, useCallback, useMemo, useRef, useState,
} from "react";
import { IconButton } from "@mui/material";
import cn from "classnames";
import { ReactSVG } from "react-svg";
import Popup from "@/components/Popup/Popup";

import threeDotsIcon from "@/shared/assets/icons/three-dots.svg";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import styles from "./UserSettings.module.scss";
import { ValueSettings, userSettingsData } from "../../data/userSettings.data";

interface UserSettingsProps {
    onChange?: (value: any) => void
}

export const UserSettings: FC<UserSettingsProps> = (props) => {
    const { onChange } = props;

    const [selectedValue, setSelectedValue] = useState<ValueSettings | null>(null);
    const [isDropdownOpened, setDropdownOpened] = useState<boolean>(false);
    const buttonRef = useRef(null);

    useOnClickOutside(buttonRef, () => setDropdownOpened(false));

    const handleOpenDropdown = () => {
        setDropdownOpened((prev) => !prev);
    };

    const selectSettings = useCallback(
        (value: ValueSettings) => {
            if (value === selectedValue) {
                setSelectedValue(null);
                onChange?.(null);
            } else {
                setSelectedValue(value);
                onChange?.(value);
            }
            setDropdownOpened(false);
        },
        [onChange, selectedValue],
    );

    const renderFilterItems = useMemo(
        () => userSettingsData.map((item) => (
            <div
                className={cn(styles.item, {
                    [styles.active]: item.value === selectedValue,
                })}
                onClick={() => selectSettings(item.value)}
            >
                <span className={styles.text}>{item.text}</span>
            </div>
        )),
        [selectSettings, selectedValue],
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
