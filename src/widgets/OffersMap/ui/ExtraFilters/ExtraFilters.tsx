import React, { FC } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";

import { LanguagesFilter, WithChildren } from "@/features/OffersMap";

import styles from "./ExtraFilters.module.scss";
import { ProvidedFilter } from "../ProvidedFilter/ProvidedFilter";

interface ExtraFiltersProps {
    isOpen: boolean;
    control: Control<FieldValues>;
}

export const ExtraFilters: FC<ExtraFiltersProps> = (props) => {
    const { isOpen, control } = props;
    return (
        isOpen && (
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
        )
    );
};
