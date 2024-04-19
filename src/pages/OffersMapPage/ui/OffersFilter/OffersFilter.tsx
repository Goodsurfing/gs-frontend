import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { PeriodsFilter } from "@/widgets/OffersMap/ui/PeriodsFilter/PeriodsFilter";

import styles from "./OffersFilter.module.scss";

export const OffersFilter = () => {
    const { control } = useFormContext();

    return (
        <div className={styles.wrapper}>
            <Controller
                name="periods"
                control={control}
                render={({ field }) => (
                    <PeriodsFilter
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
        </div>
    );
};
