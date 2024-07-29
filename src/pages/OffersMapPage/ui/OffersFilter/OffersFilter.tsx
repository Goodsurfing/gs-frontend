import React, { useRef, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Categories, ExtraFilters } from "@/widgets/OffersMap";
import { ButtonFilter } from "@/widgets/OffersMap/ui/ButtonFilter/ButtonFilter";
import { ParticipationPeriod } from "@/widgets/OffersMap/ui/ParticipationPeriod/ParticipationPeriod";
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

    const [dropdownOpened, setDropdownOpened] = useState<DropdownState>({
        isCategoriesOpened: false,
        isPeriodsOpened: false,
        isExtraFiltersOpened: false,
    });

    const watchParticipationPeriod = useWatch({
        control,
        name: "participationPeriod",
    });

    useOnClickOutside(categoriesRef, () => {
        setDropdownOpened((prev) => ({ ...prev, isCategoriesOpened: false }));
    });

    const handleOpenDropdown = (type: ButtonNav) => {
        setDropdownOpened((prev) => {
            switch (type) {
                case "CATEGORIES":
                    return {
                        isExtraFiltersOpened: false,
                        isPeriodsOpened: false,
                        isCategoriesOpened: !prev.isCategoriesOpened,
                    };
                case "PERIODS":
                    return {
                        isCategoriesOpened: false,
                        isExtraFiltersOpened: false,
                        isPeriodsOpened: !prev.isPeriodsOpened,
                    };
                case "EXTRAFILTERS":
                    return {
                        isCategoriesOpened: false,
                        isPeriodsOpened: false,
                        isExtraFiltersOpened: !prev.isExtraFiltersOpened,
                    };
                default:
                    return prev;
            }
        });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
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
                <ButtonFilter
                    text="Срок участия"
                    isShowBluePoint={
                        !(
                            watchParticipationPeriod[0] === 7
                            && watchParticipationPeriod[1] === 186
                        )
                    }
                    isOpen={dropdownOpened.isPeriodsOpened}
                    onClick={() => handleOpenDropdown("PERIODS")}
                />
                <ButtonFilter
                    text="Доп. фильтры"
                    isShowBluePoint={false}
                    isOpen={dropdownOpened.isExtraFiltersOpened}
                    onClick={() => handleOpenDropdown("EXTRAFILTERS")}
                />
            </div>
            <div className={styles.bottom}>
                <Controller
                    name="participationPeriod"
                    control={control}
                    render={({ field }) => (
                        <ParticipationPeriod
                            value={field.value}
                            onChange={field.onChange}
                            isOpen={dropdownOpened.isPeriodsOpened}
                        />
                    )}
                />
                <ExtraFilters control={control} isOpen={dropdownOpened.isExtraFiltersOpened} />
            </div>
        </div>
    );
};
