import cn from "classnames";
import { memo, useState, MouseEvent } from "react";
import deleteIcon from "@/shared/assets/icons/delete.svg";

import styles from "./EditableInputWithButton.module.scss";
import { InputWithButton } from "../InputWithButton/InputWithButton";
import IconComponent from "../IconComponent/IconComponent";

export interface EditableInputWithButtonProps {
    value: string;
    onValueChange: (value: string) => void;
    onClose?: () => void;
    onEdit?: () => void;
    className?: string;
    iconButtonClassName?: string;
    inputClassName?: string;
    inputButtonClassName?: string;
    buttonIcon: string;
    placeholder?: string;
}

export const EditableInputWithButton = memo((props: EditableInputWithButtonProps) => {
    const {
        value,
        onValueChange,
        onClose,
        onEdit,
        className,
        buttonIcon,
        iconButtonClassName,
        inputButtonClassName,
        inputClassName,
        placeholder,
    } = props;
    const [isEditing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const onCloseBtnClick = () => {
        onClose?.();
    };

    const onSubmit = () => {
        if (inputValue === value) {
            return setEditing(false);
        }
        if (inputValue) {
            onValueChange(inputValue);
            setEditing(false);
        }
    };

    const onInputClick = (e: MouseEvent<HTMLInputElement>) => {
        if (e.detail >= 2) {
            setEditing(true);
            onEdit?.();
        }
    };

    const onButtonClick = () => {
        setEditing(!isEditing);
    };

    const onInputChange = (val: string) => {
        setInputValue(val);
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            <InputWithButton
                value={inputValue}
                onButtonClick={onButtonClick}
                disabled={!isEditing}
                activeClassName={styles.activeIcon}
                checked={!isEditing}
                onChange={onInputChange}
                onClick={onInputClick}
                buttonIcon={buttonIcon}
                iconButtonClassName={iconButtonClassName}
                inputButtonClassName={inputButtonClassName}
                placeholder={placeholder}
                onSubmit={onSubmit}
                inputClassName={cn(styles.input, inputClassName, {
                    [styles.isEditing]: isEditing,
                    [styles.defaultInput]: !isEditing,
                })}
            />
            <IconComponent icon={deleteIcon} onClick={onCloseBtnClick} type="button" className={styles.closeBtnIcon} />
        </div>
    );
});
