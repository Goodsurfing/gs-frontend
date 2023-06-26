import Box from "@mui/material/Box/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography/Typography";
import React from "react";

import SwitchComponent from "@/shared/ui/Switch/Switch";

const DateCheckboxes = () => {
    return (
        <Box sx={{ display: "flex", mt: "30px" }}>
            <FormControlLabel
                label={(
                    <Typography
                        sx={{
                            fontFamily: "Lato",
                            fontWeight: "500",
                            fontSize: "16px",
                            color: "#212121",
                        }}
                    >
                        Принимаю круглый год
                    </Typography>
                )}
                control={<SwitchComponent />}
            />
            <FormControlLabel
                label={(
                    <Typography
                        sx={{
                            fontFamily: "Lato",
                            fontWeight: "500",
                            fontSize: "16px",
                            color: "#212121",
                        }}
                    >
                        Принимаю в последний момент
                    </Typography>
                )}
                control={<SwitchComponent />}
            />
        </Box>
    );
};

export default DateCheckboxes;
