import React, { FC } from "react";

import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation("offer");

    const onFromMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value < 0 || +e.target.value > 100 || !/^[0-9]+$/.test(e.target.value)) {
            return;
        }

        if (+e.target.value >= value.maxAge) {
            onChange({ ...value, maxAge: +e.target.value, minAge: +e.target.value });
        } else {
            onChange({ ...value, minAge: +e.target.value });
        }
    };

    const onFromMinAgeBlur = () => {
        if (value.minAge < MINIMAL_AGE_FOR_VOLUNTEER) {
            onChange({ ...value, minAge: MINIMAL_AGE_FOR_VOLUNTEER });
        }
    };

    const onFromMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value < 0 || +e.target.value > 100) {
            return;
        }

        if (+e.target.value < value.minAge) {
            onChange({ ...value, maxAge: +e.target.value, minAge: MINIMAL_AGE_FOR_VOLUNTEER });
        } else {
            onChange({ ...value, maxAge: +e.target.value });
        }
    };

    const onFromMaxAgeBlur = () => {
        if (value.maxAge < value.minAge) {
            onChange({
                ...value,
                maxAge: MINIMAL_AGE_FOR_VOLUNTEER,
                minAge: MINIMAL_AGE_FOR_VOLUNTEER,
            });
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
                {t("whoNeeds.Возраст")}
            </Typography>
            <div className={styles.inputWrapper}>
                <Input className={styles.from} value={value.minAge.toString()} onChange={onFromMinAgeChange} onBlur={onFromMinAgeBlur} type="number" placeholder="от" />
                <Input className={styles.to} value={value.maxAge.toString()} onChange={onFromMaxAgeChange} onBlur={onFromMaxAgeBlur} type="number" placeholder="до" />
            </div>
        </div>
    );
};
