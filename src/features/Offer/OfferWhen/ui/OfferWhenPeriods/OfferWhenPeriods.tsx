import cn from "classnames";

import { memo, useCallback, useState } from "react";

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

    const [tempPeriod, setTempPeriod] = useState<DatePeriods>({ start: undefined, end: undefined });

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

    const handleTempPeriodChange = (periods: DatePeriods) => {
        setTempPeriod(periods);
    };

    const resetTempPeriod = () => {
        setTempPeriod({ start: undefined, end: undefined });
    };

    const handleDeleteInputClick = useCallback((index: number) => {
        onChange(value.filter((_, i) => i !== index));
    }, [onChange, value]);

    const onAddBtnClick = () => {
        if (!tempPeriod.start || !tempPeriod.end) return;
        if (value.length > 4) return;

        onChange([...value, tempPeriod]);
        resetTempPeriod();
    };

    return (
        <Box className={styles.wrapper}>
            <Box className={styles.dateWrapper}>
                <DateInputs
                    onDateChange={handleTempPeriodChange}
                    value={tempPeriod}
                    close={(
                        <CloseButton
                            className={cn(
                                styles.btn,
                                { [styles.active]: !!(tempPeriod.start || tempPeriod.end) },
                            )}
                            onClick={resetTempPeriod}
                        />
                    )}
                />

                {value.map((dates, index) => (
                    <DateInputs
                        key={index}
                        onDateChange={(periods) => handlePeriodsChange(periods, index)}
                        value={dates}
                        close={(
                            <CloseButton
                                className={cn(styles.btn, styles.active)}
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
