import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button/Button";
import { OfferCategories } from "@/widgets/OfferCategories";
import { useLocale } from "@/app/providers/LocaleProvider";
import { DonationFilterFields } from "@/entities/Donation";
import { SwitchDonationFilter } from "@/widgets/Donation";
import styles from "./DonationsMobileFilter.module.scss";

interface DonationsMobileFilterProps {
    onSubmitFilters: () => void;
    onResetFilters: () => void;
}

export const DonationsMobileFilter: FC<DonationsMobileFilterProps> = (props) => {
    const { onSubmitFilters, onResetFilters } = props;
    const { control } = useFormContext<DonationFilterFields>();
    const { t } = useTranslation("donation");
    const { locale } = useLocale();

    return (
        <div className={styles.wrapper}>
            <div className={styles.filterControls}>
                <Button type="submit" onClick={onSubmitFilters} variant="TEXT" color="BLUE" size="MEDIUM">
                    {t("Применить")}
                </Button>
                <Button onClick={onResetFilters} variant="TEXT" color="BLUE" size="MEDIUM">
                    {t("Очистить все")}
                </Button>
            </div>
            <Controller
                name="category"
                control={control}
                render={({ field }) => (
                    <div>
                        <Typography className={styles.helpText}>
                            {t("Направление деятельности")}
                        </Typography>
                        <OfferCategories
                            value={field.value}
                            onChange={field.onChange}
                            locale={locale}
                        />
                    </div>
                )}
            />
            <Controller
                name="showFinishedProjects"
                control={control}
                render={({ field }) => (
                    <SwitchDonationFilter
                        text={t("Показать завершенные проекты")}
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
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
        </div>
    );
};
