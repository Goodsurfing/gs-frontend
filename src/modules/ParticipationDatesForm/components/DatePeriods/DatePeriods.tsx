import { Box } from "@mui/material";
import React, { useState } from "react";

import DateAddButton from "../DateAddButton/DateAddButton";
import DateCloseButton from "../DateCloseButton/DateCloseButton";
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
                        sx={index > 0 ? { mt: "24px" } : {}}
                        key={index}
                        close={
                            <DateCloseButton
                                sx={{ ml: "12px" }}
                                onClick={() => onCloseBtnClick(index)}
                            />
                        }
                    />
                ))}
            </Box>
            <Box sx={{ ml: 6 }}>
                <DateAddButton onClick={onAddBtnClick}>
                    Добавить период
                </DateAddButton>
            </Box>
        </Box>
    );
};

export default DatePeriods;
