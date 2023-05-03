import Switch from "@/UI/Switch/Switch";
import { Box, FormControlLabel, Typography } from "@mui/material";
import React from "react";

import DateInput from "../DateInput/DateInput";

const DateEndRequests = () => {
    return (
        <Box sx={{ marginTop: "30px" }}>
            <Typography
                sx={{
                    fontFamily: "Lato",
                    fontWeight: "400",
                    fontSize: "14px",
                    color: "#8494A1",
                }}
            >
                Дата окончания приема заявок
            </Typography>
            <Box
                sx={{
                    mt: "8px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <DateInput />
                <FormControlLabel
                    sx={{
                        ml: "60px",
                    }}
                    label={
                        <Typography
                            sx={{
                                fontFamily: "Lato",
                                fontWeight: "500",
                                fontSize: "16px",
                                color: "#212121",
                            }}
                        >
                            Нет даты окончания
                        </Typography>
                    }
                    control={<Switch />}
                />
            </Box>
        </Box>
    );
};

export default DateEndRequests;
