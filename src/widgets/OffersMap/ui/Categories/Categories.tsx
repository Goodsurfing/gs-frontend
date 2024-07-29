import React, {
    forwardRef, MouseEventHandler,
} from "react";
import cn from "classnames";
import styles from "./Categories.module.scss";
import Arrow from "@/shared/ui/Arrow/Arrow";
import Popup from "@/components/Popup/Popup";
import { OfferCategories } from "@/widgets/OfferCategories";
import { BluePoint } from "../BluePoint/BluePoint";

interface CategoriesProps {
    className?: string;
    isOpen: boolean
    onClick: MouseEventHandler<HTMLDivElement>
    value: string[]
    onChange: (value: string[]) => void
}

export const Categories = forwardRef<HTMLDivElement, CategoriesProps>((props, ref) => {
    const {
        className, isOpen, onClick, value, onChange,
    } = props;

    return (
        <div className={cn(styles.wrapper, className)} ref={ref}>
            <div
                onClick={onClick}
                className={cn(styles.btn, { [styles.open]: isOpen })}
            >
                <div className={styles.inner}>
                    Направление деятельности
                    <BluePoint isShow={value.length > 0} className={styles.bluePoint} />
                </div>
                <Arrow isOpen={isOpen} className={cn(styles.arrow, { [styles.open]: isOpen })} />
            </div>
            <Popup
                className={styles.popup}
                isOpen={isOpen}
            >
                <div className={styles.popupContainer} ref={ref}>
                    <OfferCategories value={value} onChange={onChange} />
                </div>
            </Popup>
        </div>
    );
});
