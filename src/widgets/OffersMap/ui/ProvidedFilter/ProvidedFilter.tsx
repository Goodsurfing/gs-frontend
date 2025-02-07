import React, { FC } from "react";
import { FormControlLabel, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./ProvidedFilter.module.scss";
import SwitchComponent from "@/shared/ui/Switch/Switch";
import { Provided } from "@/pages/OffersMapPage";

interface ProvidedFilterProps {
    value: Provided[];
    onChange: (value: Provided[]) => void
}

export const ProvidedFilter: FC<ProvidedFilterProps> = (props) => {
    const { value, onChange } = props;
    const { t } = useTranslation("offers-map");

    const handleChange = (selectedValue: Provided) => {
        if (value.includes(selectedValue)) {
            onChange(value.filter((g) => g !== selectedValue));
        } else {
            onChange([...value, selectedValue]);
        }
    };

    return (
        <div className={styles.wrapper}>
            <span>
                {t("Предоставляется")}
                :
            </span>
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
                        {t("Проживание")}
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
                        {t("Питание")}
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
                        {t("Проезд")}
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
