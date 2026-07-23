import React, { FC } from "react";

import { FormControlLabel, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Input from "@/shared/ui/Input/Input";
import SwitchComponent from "@/shared/ui/Switch/Switch";
import { NO_AGE_LIMIT } from "@/shared/constants/offerAge";

import { Age } from "@/entities/Offer/model/types/offerWhoNeeds";
import styles from "./Age.module.scss";

export const MINIMAL_AGE_FOR_VOLUNTEER = 12;
export const MAX_AGE_FOR_VOLUNTEER = 18;

interface AgeProps {
    value: Age;
    onChange: (value: Age) => void;
}

export const AgeComponent: FC<AgeProps> = (props) => {
    const { value, onChange } = props;
    const { t } = useTranslation("offer");

    const minAge = value.minAge ?? MINIMAL_AGE_FOR_VOLUNTEER;
    const maxAge = value.maxAge ?? MAX_AGE_FOR_VOLUNTEER;
    const isNoUpperLimit = maxAge >= NO_AGE_LIMIT;

    const onFromMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value < 0 || +e.target.value > NO_AGE_LIMIT || !/^[0-9]+$/.test(e.target.value)) {
            // return;
            onChange({
                ...value,
                maxAge: MINIMAL_AGE_FOR_VOLUNTEER,
                minAge: MINIMAL_AGE_FOR_VOLUNTEER,
            });
        }

        if (+e.target.value >= maxAge) {
            onChange({ ...value, maxAge: +e.target.value, minAge: +e.target.value });
        } else {
            onChange({ ...value, minAge: +e.target.value });
        }
    };

    const onFromMinAgeBlur = () => {
        if ((minAge < MINIMAL_AGE_FOR_VOLUNTEER) || (minAge > NO_AGE_LIMIT)) {
            onChange({
                ...value,
                minAge: MINIMAL_AGE_FOR_VOLUNTEER,
                maxAge: MINIMAL_AGE_FOR_VOLUNTEER,
            });
        }
    };

    const onFromMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value < 0 || +e.target.value > NO_AGE_LIMIT) {
            onChange({ ...value, maxAge: MINIMAL_AGE_FOR_VOLUNTEER });
        }
        onChange({ ...value, maxAge: +e.target.value });
    };

    const onFromMaxAgeBlur = () => {
        if ((maxAge < minAge) || (maxAge > NO_AGE_LIMIT)) {
            onChange({
                ...value,
                minAge: MINIMAL_AGE_FOR_VOLUNTEER,
            });
        }
    };

    const onToggleNoUpperLimit = () => {
        onChange({
            ...value,
            maxAge: isNoUpperLimit ? minAge : NO_AGE_LIMIT,
        });
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
                <Input className={styles.from} value={minAge.toString()} onChange={onFromMinAgeChange} onBlur={onFromMinAgeBlur} type="number" placeholder="от" />
                {isNoUpperLimit ? (
                    <Typography sx={{ fontFamily: "Lato", fontSize: "14px" }}>
                        {t("whoNeeds.и старше")}
                    </Typography>
                ) : (
                    <Input className={styles.to} value={maxAge.toString()} onChange={onFromMaxAgeChange} onBlur={onFromMaxAgeBlur} type="number" placeholder="до" />
                )}
            </div>
            <FormControlLabel
                label={(
                    <Typography sx={{ fontFamily: "Lato", fontSize: "14px" }}>
                        {t("whoNeeds.Без ограничения по возрасту")}
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        checked={isNoUpperLimit}
                        onChange={onToggleNoUpperLimit}
                    />
                )}
            />
        </div>
    );
};
