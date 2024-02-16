import React, { useState } from "react";

import { Typography } from "@mui/material";
import Input from "@/shared/ui/Input/Input";

import { MINIMAL_AGE_FOR_VOLUNTEER } from "../../constants";

import styles from "./Age.module.scss";

const Age = () => {
    const [minAge, setMinAge] = useState<number>(MINIMAL_AGE_FOR_VOLUNTEER);
    const [maxAge, setMaxAge] = useState<number>(18);

    const onFromMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value < 0 || +e.target.value < MINIMAL_AGE_FOR_VOLUNTEER) {
            return;
        }

        if (+e.target.value >= maxAge) {
            setMaxAge(+e.target.value);
            setMinAge(+e.target.value);
        } else {
            setMinAge(+e.target.value);
        }
    };

    const onFromMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value < 0 || +e.target.value < MINIMAL_AGE_FOR_VOLUNTEER) {
            return;
        }

        if (+e.target.value < minAge) {
            setMinAge(+e.target.value);
            setMaxAge(+e.target.value);
        } else {
            setMaxAge(+e.target.value);
        }
    };

    return (
        <div className={styles.wrapper}>
            <Typography
                sx={{
                    fontFamily: "Lato",
                    fontWeight: "400",
                    fontSize: "14px",
                    color: "#8494A1",
                }}
            >
                Возраст
            </Typography>
            <div className={styles.inputWrapper}>
                <Input className={styles.from} value={minAge} onChange={onFromMinAgeChange} type="number" placeholder="от" />
                <Input className={styles.to} value={maxAge} onChange={onFromMaxAgeChange} type="number" placeholder="до" />
            </div>
        </div>
    );
};

export default Age;
