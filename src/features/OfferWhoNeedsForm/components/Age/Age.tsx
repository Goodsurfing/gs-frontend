import React, { FC } from "react";

import { Typography } from "@mui/material";
import Input from "@/shared/ui/Input/Input";

import { MINIMAL_AGE_FOR_VOLUNTEER } from "../../constants";

import { Age } from "@/entities/Offer/model/types/offerWhoNeeds";
import styles from "./Age.module.scss";

interface AgeProps {
    value: Age;
    onChange: (value: Age) => void
}

export const AgeComponent: FC<AgeProps> = (props) => {
    const { value, onChange } = props;

    const onFromMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value < 0 || +e.target.value < MINIMAL_AGE_FOR_VOLUNTEER) {
            return;
        }

        if (+e.target.value >= value.maxAge) {
            onChange({ ...value, maxAge: +e.target.value, minAge: +e.target.value });
        } else {
            onChange({ ...value, minAge: +e.target.value });
        }
    };

    const onFromMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value < 0 || +e.target.value < MINIMAL_AGE_FOR_VOLUNTEER) {
            return;
        }

        if (+e.target.value < value.minAge) {
            onChange({ ...value, maxAge: +e.target.value, minAge: +e.target.value });
        } else {
            onChange({ ...value, maxAge: +e.target.value });
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
                <Input className={styles.from} value={value.minAge} onChange={onFromMinAgeChange} type="number" placeholder="от" />
                <Input className={styles.to} value={value.maxAge} onChange={onFromMaxAgeChange} type="number" placeholder="до" />
            </div>
        </div>
    );
};
