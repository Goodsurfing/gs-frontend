import React, { FC } from "react";
import cn from "classnames";
import { Controller, useFormContext } from "react-hook-form";
import styles from "./OffersSearchFilterMobile.module.scss";
import { SquareButton } from "@/shared/ui/SquareButton/SquareButton";
import { SelectSort } from "@/widgets/OffersMap/ui/SelectSort/SelectSort";

interface OffersSearchFilterMobileProps {
    className?: string;
}

export const OffersSearchFilterMobile: FC<OffersSearchFilterMobileProps> = (props) => {
    const { className } = props;
    const { control } = useFormContext();
    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.top}>
                <div className={styles.buttons}>
                    <SquareButton className={styles.button}>Карта</SquareButton>
                    <SquareButton className={styles.button}>Фильтр</SquareButton>
                </div>
                <Controller
                    name="sortValue"
                    control={control}
                    render={({ field }) => (
                        <SelectSort
                            value={field.value}
                            onChange={field.onChange}
                            className={styles.sortWrapper}
                            classNameControl={styles.sort}
                            classNameDropdown={styles.sortDropdown}
                        />
                    )}
                />
            </div>
        </div>
    );
};
