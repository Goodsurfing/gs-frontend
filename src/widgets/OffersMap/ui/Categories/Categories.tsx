import React, { FC, MouseEventHandler, MutableRefObject } from "react";
import cn from "classnames";
import styles from "./Categories.module.scss";
import Arrow from "@/shared/ui/Arrow/Arrow";
import Popup from "@/components/Popup/Popup";
import { OfferCategories } from "@/widgets/OfferCategories";

interface CategoriesProps {
    className?: string;
    ref: MutableRefObject<null>
    isOpen: boolean
    onClick: MouseEventHandler<HTMLDivElement>
    value: string []
    onChange: (value: string[]) => void
}

export const Categories: FC<CategoriesProps> = (props) => {
    const {
        className, ref, isOpen, onClick, value, onChange,
    } = props;
    return (
        <div className={cn(styles.wrapper, className)}>
            <div
                onClick={onClick}
                ref={ref}
                className={cn(styles.btn, { [styles.open]: isOpen })}
            >
                Направление деятельности
                <Arrow isOpen={isOpen} className={cn(styles.arrow, { [styles.open]: isOpen })} />
            </div>
            <Popup
                className={styles.popup}
                isOpen={isOpen}
            >
                <div className={styles.popupContainer}>
                    <OfferCategories value={value} onChange={onChange} />
                </div>
            </Popup>
        </div>
    );
};
