import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./OffersMobileFilter.module.scss";
import Button from "@/shared/ui/Button/Button";
import { OffersFilterFields } from "../../model/types";
import { PeriodsFilter, ParticipationPeriod } from "@/widgets/OffersMap";
import { OfferCategories } from "@/widgets/OfferCategories";
import { LanguagesGroup, WithChildren } from "@/features/OffersMap";
import { ProvidedFilter } from "@/widgets/OffersMap/ui/ProvidedFilter/ProvidedFilter";
import { useLocale } from "@/app/providers/LocaleProvider";

interface OffersMobileFilterProps {
    onSubmitFilters: () => void;
    onResetFilters: () => void;
}

export const OffersMobileFilter: FC<OffersMobileFilterProps> = (props) => {
    const { onSubmitFilters, onResetFilters } = props;
    const { control } = useFormContext<OffersFilterFields>();
    const { t } = useTranslation("offers-map");
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
                name="periods"
                control={control}
                render={({ field }) => (
                    <div>
                        <Typography className={styles.helpText}>
                            {t("Период (от-до)")}
                        </Typography>
                        <PeriodsFilter
                            wrapperClassName={styles.wrapperClassName}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    </div>
                )}
            />
            <Controller
                name="participationPeriod"
                control={control}
                render={({ field }) => (
                    <ParticipationPeriod
                        isMobile
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
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
                name="languages"
                control={control}
                render={({ field }) => (
                    <div>
                        <Typography className={styles.helpText}>
                            {t("Знание языка")}
                        </Typography>
                        <LanguagesGroup value={field.value} onChange={field.onChange} />
                    </div>
                )}
            />
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
