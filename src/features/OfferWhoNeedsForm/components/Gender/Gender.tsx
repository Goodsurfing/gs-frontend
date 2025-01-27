import { FormControlLabel, Typography } from "@mui/material";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { Gender } from "@/entities/Offer";

import SwitchComponent from "@/shared/ui/Switch/Switch";

import styles from "./Gender.module.scss";

interface GenderProps {
    value: Gender[];
    onChange: (value: Gender[]) => void;
}

export const GenderComponent: FC<GenderProps> = (props: GenderProps) => {
    const { value, onChange } = props;
    const { t } = useTranslation("offer");

    const handleGenderChange = (selectedGender: Gender) => {
        if (value.includes(selectedGender)) {
            onChange(value.filter((g) => g !== selectedGender));
            onChange(value.filter((g) => g !== selectedGender));
        } else {
            onChange([...value, selectedGender]);
            onChange([...value, selectedGender]);
        }
    };

    return (
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
                        {t("whoNeeds.Женщина")}
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        checked={value.includes("female")}
                        onChange={() => handleGenderChange("female")}
                    />
                )}
            />
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
                        {t("whoNeeds.Мужчина")}
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        checked={value.includes("male")}
                        onChange={() => handleGenderChange("male")}
                    />
                )}
            />
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
                        {t("whoNeeds.Другой")}
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        checked={value.includes("other")}
                        onChange={() => handleGenderChange("other")}
                    />
                )}
            />
        </div>
    );
};
