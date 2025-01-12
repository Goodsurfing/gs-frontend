import { ButtonBase } from "@mui/material";
import { memo } from "react";
import cn from "classnames";

import styles from "./CloseButton.module.scss";

interface CloseButtonProps {
    onClick?: () => void;
    className?: string;
}

export const CloseButton = memo(({ onClick, className }: CloseButtonProps) => {
    const onBtnClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();
        onClick?.();
    };

    return (
        <ButtonBase
            className={cn(styles.btn, className)}
            onClick={onBtnClick}
        >
            ✖
        </ButtonBase>
    );
});
