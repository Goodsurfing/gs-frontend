import cn from "classnames";

import { memo, useCallback } from "react";

import { Box } from "@mui/material";

import { useTranslation } from "react-i18next";
import { AddButton } from "@/shared/ui/AddButton/AddButton";
import { CloseButton } from "@/shared/ui/CloseButton/CloseButton";
import DateInputs from "@/shared/ui/DateInputs/DateInputs";

import type { DatePeriods } from "../../model/types/offerWhen";

import styles from "./OfferWhenPeriods.module.scss";

interface OfferWhenPeriodsProps {
    value: DatePeriods[];
    onChange: (period: DatePeriods[]) => void;
}

export const OfferWhenPeriods = memo(({ value, onChange }: OfferWhenPeriodsProps) => {
    const { t } = useTranslation("offer");

    const handlePeriodsChange = (periods: DatePeriods, index: number) => {
        if (value) {
            onChange(value.map((period, i) => {
                if (i === index) {
                    return periods;
                }
                return period;
            }));
        }
    };

    const handleDeleteInputClick = useCallback((index: number) => {
        if (index === 0) return;
        onChange(value.filter((_, i) => i !== index));
    }, [onChange, value]);

    const onAddBtnClick = () => {
        if ((value[0].start == null) || (value[0].end == null)) return;
        if (value.length > 4) {
            return;
        }
        onChange([...value, { start: new Date(), end: new Date() }]);
    };

    return (
        <Box className={styles.wrapper}>
            <Box className={styles.dateWrapper}>
                {value.map((dates, index) => (
                    <DateInputs
                        key={index}
                        onDateChange={(periods) => handlePeriodsChange(periods, index)}
                        value={dates}
                        close={(
                            <CloseButton
                                className={cn(styles.btn, {
                                    [styles.active]: index > 0,
                                })}
                                onClick={() => handleDeleteInputClick(index)}
                            />
                        )}
                    />
                ))}
            </Box>
            <Box className={styles.add}>
                <AddButton text={t("when.Добавить период")} onClick={onAddBtnClick} />
            </Box>
        </Box>
    );
});
