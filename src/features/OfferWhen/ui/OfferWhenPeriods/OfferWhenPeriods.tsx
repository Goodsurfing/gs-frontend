import { useState, useCallback, memo } from "react";

import { Box } from "@mui/material";
import { AddButton } from "@/shared/ui/AddButton/AddButton";
import { CloseButton } from "@/shared/ui/CloseButton/CloseButton";

import DateInputs from "@/shared/ui/DateInputs/DateInputs";

import styles from "./OfferWhenPeriods.module.scss";

export const OfferWhenPeriods = memo(() => {
    const [addButtons, setAddButtons] = useState<Array<number>>([0]);

    const onAddBtnClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();
        if (addButtons.length > 4) {
            return;
        }

        setAddButtons((prev) => [...prev, 0]);
    };

    const handleCloseBtnClick = useCallback((index: number) => {
        if (index === 0) return;
        setAddButtons(addButtons.filter((_, i) => i !== index));
    }, [addButtons]);

    return (
        <Box sx={{ display: "flex" }}>
            <Box>
                {addButtons.map((_, index) => (
                    <DateInputs
                        key={index}
                        close={index !== 0 && (
                            <CloseButton
                                className={styles.btn}
                                onClick={() => handleCloseBtnClick(index)}
                            />
                        )}
                    />
                ))}
            </Box>
            <Box sx={{ ml: 6 }}>
                <AddButton onClick={onAddBtnClick}>Добавить период</AddButton>
            </Box>
        </Box>
    );
});
