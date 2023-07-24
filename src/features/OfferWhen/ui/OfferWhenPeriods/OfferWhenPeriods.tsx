import {
    useState,
    useCallback,
    memo,
    ReactNode,
} from "react";

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
    const [inputList, setInputList] = useState<ReactNode[]>([]);

    const handlePeriodsChange = useCallback(
        (periods: DatePeriods, index: number) => {
            if (value) {
                const updatedVal = [...value];
                updatedVal[index] = { ...updatedVal[index], start: periods.start, end: periods.end };
                onChange(updatedVal);
            } else {
                onChange([periods]);
            }
        },
        [value, onChange],
    );

    const handleDeleteInputClick = useCallback((index: number) => {
        if (index === 0) return;
        setInputList(inputList.filter((_, i) => i !== index));
        onChange?.(value.filter((_, i) => i !== index));
    }, [inputList, onChange, value]);

    const onAddBtnClick = useCallback((
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();
        if (inputList.length > 4) {
            return;
        }
        onChange([...value, { start: new Date(), end: new Date() }]);
        setInputList(inputList.concat(
            <DateInputs
                key={inputList.length}
                onDateChange={(dates) => handlePeriodsChange(dates, inputList.length)}
                value={value[inputList.length]}
                close={inputList.length !== 0 && (
                    <CloseButton
                        className={styles.btn}
                        onClick={() => handleDeleteInputClick(inputList.length)}
                    />
                )}
            />,
        ));
    }, [handleDeleteInputClick, handlePeriodsChange, inputList, onChange, value]);

    return (
        <Box className={styles.wrapper}>
            <Box className={styles.dateWrapper}>{inputList}</Box>
            <Box className={styles.add}>
                <AddButton onClick={onAddBtnClick}>Добавить период</AddButton>
            </Box>
        </Box>
    );
});
