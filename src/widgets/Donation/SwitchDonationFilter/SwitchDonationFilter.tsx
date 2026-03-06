import { FormControlLabel, Typography } from "@mui/material";
import React, { FC } from "react";

import cn from "classnames";
import SwitchComponent from "@/shared/ui/Switch/Switch";

interface SwitchDonationFilterProps {
    text: string;
    value: boolean;
    onChange: (value: boolean) => void;
    className?: string;
}

export const SwitchDonationFilter: FC<SwitchDonationFilterProps> = (props) => {
    const {
        text, value, onChange, className,
    } = props;

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
                        {text}
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
