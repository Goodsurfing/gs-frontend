import { IconButton } from "@mui/material";
import cn from "classnames";
import { ButtonHTMLAttributes, memo } from "react";

import plusIcon from "@/shared/assets/icons/plus-icon.svg";

import IconComponent from "../IconComponent/IconComponent";
import styles from "./AddButton.module.scss";

interface AddButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    classNameIcon?: string;
    id?: string;
}

export const AddButton = memo(
    ({
        className, onClick, text, classNameIcon, disabled, id,
    }: AddButtonProps) => {
        const onBtnClick = (
            e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        ) => {
            e.preventDefault();
            onClick?.(e);
        };

        return (
            <IconButton
                className={cn(className, styles.button)}
                onClick={onBtnClick}
                disabled={disabled}
                id={id}
            >
                <IconComponent
                    icon={plusIcon}
                    className={cn(classNameIcon, styles.plus)}
                    alt="add"
                />
                {text}
            </IconButton>
        );
    },
);
