import { FormControlLabel, Typography } from "@mui/material";
import React, { FC } from "react";

import cn from "classnames";
import { useTranslation } from "react-i18next";
import SwitchComponent from "@/shared/ui/Switch/Switch";

interface SwitchClosedOffersProps {
    value: boolean;
    onChange: (value: boolean) => void;
    className?: string;
}

export const SwitchClosedOffers: FC<SwitchClosedOffersProps> = (props) => {
    const { value, onChange, className } = props;
    const { t } = useTranslation("offers-map");

    return (
        <div className={cn(className)}>
            <FormControlLabel
                label={(
                    <Typography
                        sx={{
                            fontFamily: "Lato",
                            fontWeight: "500",
                            fontSize: "14px",
                            color: "#212121",
                        }}
                    >
                        {t("Показать прошедние")}
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
