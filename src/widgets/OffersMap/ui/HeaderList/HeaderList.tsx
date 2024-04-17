import React, { FC } from "react";

import { Controller, useFormContext } from "react-hook-form";
import styles from "./HeaderList.module.scss";
import { SwitchClosedOffers } from "../SwitchClosedOffers/SwitchClosedOffers";
import { SelectSort } from "../SelectSort/SelectSort";
import { ButtonClose } from "../ButtonClose/ButtonClose";

interface HeaderListProps {
    isShowMap: boolean;
    onChangeShowMap: (value: boolean) => void
}

export const HeaderList: FC<HeaderListProps> = (props) => {
    const { isShowMap, onChangeShowMap } = props;
    const { control } = useFormContext();

    return (
        <div className={styles.wrapper}>
            <span className={styles.offerCount}>2 059 вариантов</span>
            <Controller
                name="showClosedOffers"
                control={control}
                render={({ field }) => (
                    <SwitchClosedOffers value={field.value} onChange={field.onChange} />
                )}
            />
            <Controller
                name="sortValue"
                control={control}
                render={({ field }) => (
                    <SelectSort value={field.value} onChange={field.onChange} />
                )}
            />
            <ButtonClose value={isShowMap} onChange={onChangeShowMap} />
        </div>
    );
};
