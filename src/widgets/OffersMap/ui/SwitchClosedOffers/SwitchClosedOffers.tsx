import { FormControlLabel, Typography } from "@mui/material";
import React, { FC } from "react";

import SwitchComponent from "@/shared/ui/Switch/Switch";

interface SwitchClosedOffersProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

export const SwitchClosedOffers: FC<SwitchClosedOffersProps> = (props) => {
    const { value, onChange } = props;
    return (
        <div>
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
                        Показать прошедние
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
