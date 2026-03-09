import React, { FC } from "react";

import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SelectSort } from "../SelectSort/SelectSort";
import { ButtonClose } from "../ButtonClose/ButtonClose";
import { DonationFilterFields } from "@/entities/Donation";
import useWindowDimensions from "@/shared/hooks/useWindowDimensions";
import styles from "./HeaderList.module.scss";

interface HeaderListProps {
    isShowMap: boolean;
    onChangeShowMap: () => void;
    donationsLength: number;
}

export const HeaderList: FC<HeaderListProps> = (props) => {
    const { isShowMap, onChangeShowMap, donationsLength } = props;
    const { control } = useFormContext<DonationFilterFields>();
    const { width } = useWindowDimensions();
    const { t } = useTranslation("offers-map");

    return (
        <div className={styles.wrapper}>
            <span className={styles.offerCount}>
                {donationsLength}
                {" "}
                {t("вариантов")}
            </span>
            <Controller
                name="sort"
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
