import { Box, FormControlLabel, Typography } from "@mui/material";
import React, { FC, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Gender } from "@/entities/Offer";

import SwitchComponent from "@/shared/ui/Switch/Switch";

interface GenderProps {
    value: Gender[];
    onChange: (value: Gender[]) => void;
}

export const GenderComponent: FC<GenderProps> = (props: GenderProps) => {
    const { value, onChange } = props;
    // const [gender, setGender] = useState<Gender[]>(value);
    const { t } = useTranslation("offer");

    useEffect(() => {
        console.log(value);
    }, [value]);

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
        </Box>
    );
};
