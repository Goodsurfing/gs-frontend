import React, { useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Categories } from "@/widgets/OffersMap";
import { PeriodsFilter } from "@/widgets/OffersMap/ui/PeriodsFilter/PeriodsFilter";

import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import styles from "./OffersFilter.module.scss";

interface DropdownState {
    isCategoriesOpened: boolean;
    isPeriodsOpened: boolean;
    isExtraFiltersOpened: boolean;
}

type ButtonNav = "CATEGORIES" | "PERIODS" | "EXTRAFILTERS";

export const OffersFilter = () => {
    const { control } = useFormContext();

    const categoriesRef = useRef(null);
    const periodsRef = useRef(null);
    const extraFiltersRef = useRef(null);

    const [dropdownOpened, setDropdownOpened] = useState<DropdownState>({
        isCategoriesOpened: false,
        isPeriodsOpened: false,
        isExtraFiltersOpened: false,
    });

    useOnClickOutside(categoriesRef, () => {
        console.log("useOnClickOutside");
        setDropdownOpened(
            (prev) => ({ ...prev, isCategoriesOpened: false }),
        );
    });
    useOnClickOutside(periodsRef, () => setDropdownOpened(
        (prev) => ({ ...prev, isPeriodsOpened: false }),
    ));
    useOnClickOutside(extraFiltersRef, () => setDropdownOpened(
        (prev) => ({ ...prev, isExtraFiltersOpened: false }),
    ));

    const handleOpenDropdown = (type: ButtonNav) => {
        setDropdownOpened((prev) => {
            switch (type) {
                case "CATEGORIES":
                    return {
                        ...prev,
                        isCategoriesOpened: !prev.isCategoriesOpened,
                    };
                case "PERIODS":
                    return {
                        ...prev,
                        isPeriodsOpened: !prev.isPeriodsOpened,
                    };
                case "EXTRAFILTERS":
                    return {
                        ...prev,
                        isExtraFiltersOpened: !prev.isExtraFiltersOpened,
                    };
                default:
                    return prev;
            }
        });
    };

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
            <Controller
                name="category"
                control={control}
                render={({ field }) => (
                    <Categories
                        value={field.value}
                        onChange={field.onChange}
                        onClick={() => handleOpenDropdown("CATEGORIES")}
                        isOpen={dropdownOpened.isCategoriesOpened}
                        ref={categoriesRef}
                    />
                )}
            />

        </div>
    );
};
