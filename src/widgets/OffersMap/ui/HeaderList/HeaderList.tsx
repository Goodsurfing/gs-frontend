import React, { FC } from "react";

import { Controller, useFormContext } from "react-hook-form";
import styles from "./HeaderList.module.scss";
import { SwitchClosedOffers } from "../SwitchClosedOffers/SwitchClosedOffers";
import { SelectSort } from "../SelectSort/SelectSort";
import { ButtonClose } from "../ButtonClose/ButtonClose";
import useWindowDimensions from "@/shared/hooks/useWindowDimensions";
import { OffersFilterFields } from "@/pages/OffersMapPage/model/types";

interface HeaderListProps {
    isShowMap: boolean;
    onChangeShowMap: () => void
}

export const HeaderList: FC<HeaderListProps> = (props) => {
    const { isShowMap, onChangeShowMap } = props;
    const { control } = useFormContext<OffersFilterFields>();
    const { width } = useWindowDimensions();

    return (
        <div className={styles.wrapper}>
            <span className={styles.offerCount}>2 059 вариантов</span>
            <Controller
                name="offersSort.showClosedOffers"
                control={control}
                render={({ field }) => (
                    <SwitchClosedOffers value={field.value} onChange={field.onChange} />
                )}
            />
            <Controller
                name="offersSort.sortValue"
                control={control}
                render={({ field }) => (
                    <SelectSort value={field.value} onChange={field.onChange} />
                )}
            />
            {(width > 992) && (
                <ButtonClose value={isShowMap} onChange={onChangeShowMap} />
            )}
        </div>
    );
};
