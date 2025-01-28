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

export const OffersMobileFilter: FC = () => {
    const { control } = useFormContext<OffersFilterFields>();
    const { t } = useTranslation("offers-map");

    return (
        <div className={styles.wrapper}>
            <div className={styles.filterControls}>
                <Button variant="TEXT" color="BLUE" size="MEDIUM">
                    {t("Применить")}
                </Button>
                <Button variant="TEXT" color="BLUE" size="MEDIUM">
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
                        isOpen
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
                        <OfferCategories value={field.value} onChange={field.onChange} />
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
