import { FormControlLabel, Switch, Typography } from "@mui/material";
import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import styles from "./ExtraControl.module.scss";

interface ExtraControlsProps {
    value: boolean;
    onChange: (value: boolean) => void
}

const ExtraControls: FC<ExtraControlsProps> = (props: ExtraControlsProps) => {
    const { value, onChange } = props;
    const { t } = useTranslation("offer");

    return (
        <div className={styles.wrapper}>
            <FormControlLabel
                onChange={() => onChange((!value))}
                label={(
                    <Typography
                        sx={{
                            fontFamily: "Lato",
                            fontWeight: "400",
                            fontSize: "16px",
                            color: "#212121",
                        }}
                    >
                        {t("whoNeeds.Обязателен один из этих языков")}
                    </Typography>
                )}
                control={<Switch checked={value === false} />}
            />
            <FormControlLabel
                sx={{ ml: "30px" }}
                onChange={() => onChange((!value))}
                label={(
                    <Typography
                        sx={{
                            fontFamily: "Lato",
                            fontWeight: "400",
                            fontSize: "16px",
                            color: "#212121",
                        }}
                    >
                        {t("whoNeeds.Все перечисленные языки обязательны")}
                    </Typography>
                )}
                control={<Switch checked={value === true} />}
            />
        </div>
    );
};

export default ExtraControls;
