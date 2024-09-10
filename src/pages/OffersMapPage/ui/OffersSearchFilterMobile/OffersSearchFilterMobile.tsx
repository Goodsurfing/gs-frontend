import React, { FC } from "react";
import cn from "classnames";
import styles from "./OffersSearchFilterMobile.module.scss";
import { SquareButton } from "@/shared/ui/SquareButton/SquareButton";

interface OffersSearchFilterMobileProps {
    className?: string;
}

export const OffersSearchFilterMobile: FC<OffersSearchFilterMobileProps> = (props) => {
    const { className } = props;
    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <div className={styles.buttons}>
                    <SquareButton />
                </div>
            </div>
        </div>
    );
};
