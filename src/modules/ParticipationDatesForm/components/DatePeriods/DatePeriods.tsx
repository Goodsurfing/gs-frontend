import { Box } from "@mui/material";
import React, { useState } from "react";

import AddButton from "@/UI/AddButton/AddButton";
import CloseButton from "@/UI/CloseButton/CloseButton";

import DateInputs from "../DateInputs/DateInputs";

const DatePeriods = () => {
    const [addButtons, setAddButtons] = useState<Array<number>>([0]);

    const onAddBtnClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (addButtons.length > 4) {
            return;
        }

        setAddButtons((prev) => [...prev, 0]);
    };

    const onCloseBtnClick = (index: number) => {
        if (index === 0) return;
        setAddButtons(addButtons.filter((_, i) => i !== index));
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Box>
                {addButtons.map((_, index) => (                   
                    <DateInputs
                        sx={{ mt: index > 0 ? "24px" : "" }}
                        key={index}
                        close={
                            <CloseButton
                                sx={{ ml: "12px" }}
                                onClick={() => onCloseBtnClick(index)}
                            />
                        }
                    />
                ))}
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
