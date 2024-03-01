import { Box, FormControlLabel, Typography } from "@mui/material";
import React, { FC, useState } from "react";

import { Gender } from "@/entities/Offer";

import SwitchComponent from "@/shared/ui/Switch/Switch";

interface GenderProps {
    value: Gender;
    onChange: (value: Gender) => void;
}

export const GenderComponent: FC<GenderProps> = (props: GenderProps) => {
    const { value, onChange } = props;
    const [gender, setGender] = useState<Gender>(value);

    const handleGenderChange = (selectedGender: Gender) => {
        setGender(selectedGender);
        onChange(selectedGender);
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
                        Женщина
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        checked={gender === "woman"}
                        onClick={() => handleGenderChange("woman")}
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
                        Мужчина
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        checked={gender === "man"}
                        onClick={() => handleGenderChange("man")}
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
                        Другой
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        checked={gender === "other"}
                        onClick={() => handleGenderChange("other")}
                    />
                )}
            />
        </Box>
    );
};
