import { Box, FormControlLabel, Typography } from "@mui/material";
import React, { FC, useState } from "react";

import { useTranslation } from "react-i18next";
import { Gender } from "@/entities/Offer";

import SwitchComponent from "@/shared/ui/Switch/Switch";

interface GenderProps {
    value: Gender[];
    onChange: (value: Gender[]) => void;
}

export const GenderComponent: FC<GenderProps> = (props: GenderProps) => {
    const { value, onChange } = props;
    const [gender, setGender] = useState<Gender[]>(value);
    const { t } = useTranslation("offer");

    const handleGenderChange = (selectedGender: Gender) => {
        if (gender.includes(selectedGender)) {
            setGender(gender.filter((g) => g !== selectedGender));
            onChange(gender.filter((g) => g !== selectedGender));
        } else {
            setGender([...gender, selectedGender]);
            onChange([...gender, selectedGender]);
        }
    };

    return (
        <Box sx={{ display: "flex", mt: "30px" }}>
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
                        checked={gender.includes("female")}
                        onClick={() => handleGenderChange("female")}
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
                        checked={gender.includes("male")}
                        onClick={() => handleGenderChange("male")}
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
                        checked={gender.includes("other")}
                        onClick={() => handleGenderChange("other")}
                    />
                )}
            />
        </Box>
    );
};
