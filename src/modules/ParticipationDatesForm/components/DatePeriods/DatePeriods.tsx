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
        setAddButtons(addButtons.filter((_, i) => i !== index));
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Box>
                {addButtons.map((_, index) => (
                    <DateInputs
                        key={index}
                        close={
                            index > 0 ? (
                                <DateCloseButton
                                    onClick={() => {
                                        onCloseBtnClick(index);
                                    }}
                                    sx={{ ml: 3 }}
                                />
                            ) : null
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
