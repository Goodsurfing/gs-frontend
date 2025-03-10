import React, { FC } from "react";
import { FormControlLabel, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./WithChildren.module.scss";
import SwitchComponent from "@/shared/ui/Switch/Switch";

interface WithChildrenProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

export const WithChildren: FC<WithChildrenProps> = (props) => {
    const { value, onChange } = props;
    const { t } = useTranslation("offers-map");

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
                        {t("Можно с детьми")}
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        checked={value}
                        onChange={() => onChange(!value)}
                    />
                )}
            />
        </div>
    );
};
