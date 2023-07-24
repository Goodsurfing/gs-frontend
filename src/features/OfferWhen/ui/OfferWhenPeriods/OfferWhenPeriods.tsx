import { memo } from "react";

import { Box } from "@mui/material";

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
    const handlePeriodsChange = (periods: DatePeriods, index: number) => {
        if (value) {
            onChange(value.map((period, i) => {
                if (i === index) {
                    return { start: periods.start, end: periods.end };
                }
                return period;
            }));
        }
    };

    const handleDeleteInputClick = (index: number) => {
        if (index === 0) return;
        onChange(value.filter((_, i) => i !== index));
    };

    const onAddBtnClick = () => {
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
                        close={index !== 0 && (
                            <CloseButton
                                className={styles.btn}
                                onClick={() => handleDeleteInputClick(index)}
                            />
                        )}
                    />
                ))}
            </Box>
            <Box className={styles.add}>
                <AddButton onClick={onAddBtnClick}>Добавить период</AddButton>
            </Box>
        </Box>
    );
});
