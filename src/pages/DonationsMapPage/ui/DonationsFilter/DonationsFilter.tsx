import cn from "classnames";
import React, { FC, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Categories } from "@/widgets/OffersMap";

import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import Button from "@/shared/ui/Button/Button";
import { DonationFilterFields } from "@/entities/Donation";
import { SwitchDonationFilter } from "@/widgets/Donation";
import styles from "./DonationsFilter.module.scss";

interface DropdownState {
    isCategoriesOpened: boolean;
}

type ButtonNav = "CATEGORIES";

interface DonationsFilterProps {
    className?: string;
    onSubmit: () => void;
    onResetFilters: () => void;
}

export const DonationsFilter: FC<DonationsFilterProps> = (props) => {
    const { className, onResetFilters, onSubmit } = props;
    const { control } = useFormContext<DonationFilterFields>();
    const { t } = useTranslation("donation");

    const categoriesRef = useRef(null);

    const [dropdownOpened, setDropdownOpened] = useState<DropdownState>({
        isCategoriesOpened: false,
    });

    useOnClickOutside(categoriesRef, () => {
        setDropdownOpened((prev) => ({ ...prev, isCategoriesOpened: false }));
    });

    const handleOpenDropdown = (type: ButtonNav) => {
        setDropdownOpened((prev) => {
            switch (type) {
            case "CATEGORIES":
                return {
                    isCategoriesOpened: !prev.isCategoriesOpened,
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
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <Categories
                            value={field.value}
                            onChange={field.onChange}
                            onClick={() => handleOpenDropdown("CATEGORIES")}
                            isOpen={dropdownOpened.isCategoriesOpened}
                            ref={categoriesRef}
                            className={styles.categories}
                        />
                    )}
                />
                <Controller
                    name="showFinishedProjects"
                    control={control}
                    render={({ field }) => (
                        <SwitchDonationFilter
                            text={t("Показать завершенные проекты")}
                            className={styles.switch}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    name="showSuccessProjects"
                    control={control}
                    render={({ field }) => (
                        <SwitchDonationFilter
                            text={t("Показать только успешные проекты")}
                            className={styles.switch}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <div className={styles.buttons}>
                    <Button onClick={onSubmit} className={styles.button} color="BLUE" size="SMALL" variant="FILL">
                        {t("Применить")}
                    </Button>
                    <Button className={styles.button} onClick={onResetFilters} color="BLUE" size="SMALL" variant="TEXT">
                        {t("Очистить все")}
                    </Button>
                </div>
            </div>
        </div>
    );
};
