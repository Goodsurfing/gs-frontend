import React, { FC } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";

import { LanguagesFilter, WithChildren } from "@/features/OffersMap";

import { ProvidedFilter } from "../ProvidedFilter/ProvidedFilter";
import styles from "./ExtraFilters.module.scss";

interface ExtraFiltersProps {
    control: Control<FieldValues>;
}

export const ExtraFilters: FC<ExtraFiltersProps> = (
    props: ExtraFiltersProps,
) => {
    const { control } = props;
    return (

        <div className={styles.wrapper}>
            <div className={styles.left}>
                <Controller
                    name="withChildren"
                    control={control}
                    render={({ field }) => (
                        <WithChildren
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    name="languages"
                    control={control}
                    render={({ field }) => (
                        <LanguagesFilter
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            </div>
            <Controller
                name="provided"
                control={control}
                render={({ field }) => (
                    <ProvidedFilter
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
        </div>
    );
};
