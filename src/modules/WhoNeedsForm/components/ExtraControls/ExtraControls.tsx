import { FormControlLabel, Switch, Typography } from "@mui/material";
import React from "react";

import styles from "./ExtraControl.module.scss";

const ExtraControls = () => (
    <div className={styles.wrapper}>
        <FormControlLabel
            label={(
                <Typography
                    sx={{
                        fontFamily: "Lato",
                        fontWeight: "400",
                        fontSize: "16px",
                        color: "#212121",
                    }}
                >
                    Обязателен один из этих ярыков
                </Typography>
            )}
            control={<Switch />}
        />
        <FormControlLabel
            sx={{ ml: "30px" }}
            label={(
                <Typography
                    sx={{
                        fontFamily: "Lato",
                        fontWeight: "400",
                        fontSize: "16px",
                        color: "#212121",
                    }}
                >
                    Все перечисленные языки обязательны
                </Typography>
            )}
            control={<Switch />}
        />
    </div>
);

export default ExtraControls;
