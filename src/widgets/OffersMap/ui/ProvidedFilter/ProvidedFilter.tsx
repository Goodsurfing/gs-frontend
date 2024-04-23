import React, { FC } from "react";
import { FormControlLabel, Typography } from "@mui/material";
import styles from "./ProvidedFilter.module.scss";
import SwitchComponent from "@/shared/ui/Switch/Switch";
import { Provided } from "@/pages/OffersMapPage";

interface ProvidedFilterProps {
    value: Provided[];
    onChange: (value: Provided[]) => void
}

export const ProvidedFilter: FC<ProvidedFilterProps> = (props) => {
    const { value, onChange } = props;

    const handleChange = (selectedValue: Provided) => {
        if (value.includes(selectedValue)) {
            onChange(value.filter((g) => g !== selectedValue));
        } else {
            onChange([...value, selectedValue]);
        }
    };

    return (
        <div className={styles.wrapper}>
            <span>Предоставляется:</span>
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
                        Проживание
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        checked={value.includes("housing")}
                        onChange={() => handleChange("housing")}
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
                        Питание
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        checked={value.includes("food")}
                        onChange={() => handleChange("food")}
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
                        Проезд
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        checked={value.includes("padidTravel")}
                        onChange={() => handleChange("padidTravel")}
                    />
                )}
            />
        </div>
    );
};
