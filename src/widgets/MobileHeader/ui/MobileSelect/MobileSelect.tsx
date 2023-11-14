import { Button } from "@mui/material";
import cn from "classnames";
import React, {
    ButtonHTMLAttributes,
    FC,
    ForwardedRef,
    PropsWithChildren,
} from "react";

import Arrow from "@/shared/ui/Arrow/Arrow";

import styles from "./MobileSelect.module.scss";

interface MobileSelectProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isOpen: boolean;
    title: string;
    classNameSelectContainer?: string;
    ref?: ForwardedRef<HTMLButtonElement>;
}

export const MobileSelect: FC<PropsWithChildren<MobileSelectProps>> = ({
    isOpen,
    title,
    children,
    onClick,
    classNameSelectContainer,
    ref,
}: MobileSelectProps) => (
    <div className={styles.wrapper}>
        <Button
            variant="text"
            onClick={onClick}
            endIcon={(
                <Arrow
                    className={cn({ [styles.arrowActive]: isOpen })}
                    isOpen={isOpen}
                />
            )}
            className={cn(styles.button, { [styles.active]: isOpen })}
            ref={ref}
        >
            {title}
        </Button>

        <div
            className={cn(
                styles.selectContainer,
                { [styles.open]: isOpen },
                classNameSelectContainer,
            )}
        >
            {children}
        </div>
    </div>
);
