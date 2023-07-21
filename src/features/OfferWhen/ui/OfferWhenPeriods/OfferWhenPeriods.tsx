import { useState, useCallback, memo, ReactNode } from "react";

import { Box } from "@mui/material";
import { AddButton } from "@/shared/ui/AddButton/AddButton";
import { CloseButton } from "@/shared/ui/CloseButton/CloseButton";

import DateInputs from "@/shared/ui/DateInputs/DateInputs";

import type { DatePeriods } from "../../model/types/offerWhen";

import styles from "./OfferWhenPeriods.module.scss";

interface OfferWhenPeriodsProps {
    value: DatePeriods[];
    onChange?: (period: DatePeriods[]) => void;
}

export const OfferWhenPeriods = memo(({ value, onChange }: OfferWhenPeriodsProps) => {
    const [inputList, setInputList] = useState<ReactNode[]>([]);
    const handlePeriodsChange = useCallback((periods: { from: Date, to: Date }) => {
        if (value) {
            onChange?.([...value, periods]);
        } else {
            onChange?.([{ ...periods }]);
        }
    }, [value, onChange]);

    const handleDeleteInputClick = useCallback((index: number) => {
        if (index === 0) return;
        setInputList(inputList.filter((_, i) => i !== index));
    }, [inputList]);

    const onAddBtnClick = useCallback((
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();
        if (inputList.length > 4) {
            return;
        }

        setInputList(inputList.concat(
            <DateInputs
                key={inputList.length}
                onDateChange={handlePeriodsChange}
                value={value[inputList.length]}
                close={
                    <CloseButton
                        className={styles.btn}
                        onClick={() => handleDeleteInputClick(inputList.length)}
                    />
                }
            />));
    }, [inputList.length]);


    return (
        <Box className={styles.wrapper}>
            <Box className={styles.dateWrapper}>
                {inputList}
            </Box>
            <Box className={styles.add}>
                <AddButton onClick={onAddBtnClick}>Добавить период</AddButton>
            </Box>
        </Box>
    );
});
