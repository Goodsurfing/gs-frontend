import { Box } from "@mui/material";
import React, { useState } from "react";

import AddButton from "@/shared/ui/AddButton/AddButton";
import CloseButton from "@/shared/ui/CloseButton/CloseButton";

import DateInputs from "../DateInputs/DateInputs";

const DatePeriods = () => {
    const [addButtons, setAddButtons] = useState<Array<number>>([0]);

    const onAddBtnClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();
        if (addButtons.length > 4) {
            return;
        }

        setAddButtons((prev) => { return [...prev, 0]; });
    };

    const onCloseBtnClick = (index: number) => {
        if (index === 0) return;
        setAddButtons(addButtons.filter((_, i) => { return i !== index; }));
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Box>
                {addButtons.map((_, index) => {
                    return (
                        <DateInputs
                            sx={{ mt: index > 0 ? "24px" : "" }}
                            key={index}
                            close={(
                                <CloseButton
                                    sx={{ ml: "12px" }}
                                    onClick={() => { return onCloseBtnClick(index); }}
                                />
                            )}
                        />
                    );
                })}
            </Box>
            <Box sx={{ ml: 6 }}>
                <AddButton onClick={onAddBtnClick}>
                    Добавить период
                </AddButton>
            </Box>
        </Box>
    );
};

export default DatePeriods;
