import cn from "classnames";
import React, { FC, useRef, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Categories, ExtraFilters } from "@/widgets/OffersMap";
import { ButtonFilter } from "@/widgets/OffersMap/ui/ButtonFilter/ButtonFilter";
import { ParticipationPeriod } from "@/widgets/OffersMap/ui/ParticipationPeriod/ParticipationPeriod";
import { PeriodsFilter } from "@/widgets/OffersMap/ui/PeriodsFilter/PeriodsFilter";

import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import styles from "./OffersFilter.module.scss";
import Button from "@/shared/ui/Button/Button";

interface DropdownState {
    isCategoriesOpened: boolean;
    isPeriodsOpened: boolean;
    isExtraFiltersOpened: boolean;
}

type ButtonNav = "CATEGORIES" | "PERIODS" | "EXTRAFILTERS";

interface OffersFilterProps {
    className?: string;
    onResetFilters: () => void;
}

export const OffersFilter: FC<OffersFilterProps> = (props) => {
    const { className, onResetFilters } = props;
    const { control } = useFormContext();
    const { t } = useTranslation("offers-map");

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
        <div className={cn(styles.wrapper, className)}>
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
                    text={t("Срок участия")}
                    isShowBluePoint={
                        !(
                            watchParticipationPeriod[0] === 1
                            && watchParticipationPeriod[1] === 190
                        )
                    }
                    isOpen={dropdownOpened.isPeriodsOpened}
                    onClick={() => handleOpenDropdown("PERIODS")}
                />
                <ButtonFilter
                    text={t("Доп. фильтры")}
                    isShowBluePoint={false}
                    isOpen={dropdownOpened.isExtraFiltersOpened}
                    onClick={() => handleOpenDropdown("EXTRAFILTERS")}
                />

                <div className={styles.buttons}>
                    <Button className={styles.button} type="submit" color="BLUE" size="SMALL" variant="FILL">
                        {t("Применить")}
                    </Button>
                    <Button className={styles.button} onClick={onResetFilters} color="BLUE" size="SMALL" variant="TEXT">
                        {t("Очистить все")}
                    </Button>
                </div>
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
                <ExtraFilters
                    control={control}
                    isOpen={dropdownOpened.isExtraFiltersOpened}
                />
            </div>
        </div>
    );
};
