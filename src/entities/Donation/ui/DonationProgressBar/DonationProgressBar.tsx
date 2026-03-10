import React from "react";
import { LinearProgress } from "@mui/material";
import cn from "classnames";

interface DonationProgressBarProps {
    value: number;
    isSuccess?: boolean;
    className?: string;
}

export const DonationProgressBar: React.FC<DonationProgressBarProps> = (props) => {
    const { value, isSuccess = false, className } = props;
    return (
        <div className={cn(className)}>
            <LinearProgress
                variant="determinate"
                value={value}
                sx={{
                    height: 5,
                    borderRadius: 2.5,
                    backgroundColor: isSuccess ? "#21212126" : "#3CABF740",
                    "& .MuiLinearProgress-bar": {
                        backgroundColor: isSuccess ? "#8494A1" : "#3DABF7",
                        borderRadius: 2.5,
                    },
                }}
            />
        </div>
    );
};
