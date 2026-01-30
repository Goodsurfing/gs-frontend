import { FC, useCallback } from "react";
import { Slider, styled } from "@mui/material";
import { SliderProps } from "@mui/material/Slider";

import { useFormatMonthDay } from "@/shared/utils/date/formatMonthDay";

export type Mark = {
    value: number;
    label: string;
};

type RangeSliderProps = {
    minDistanсe?: number;
    value?: number[];
    min?: number;
    max?: number;
    track?: boolean;
    marks?: Mark[];
    onValueChange?: (value: number[]) => void;
} & SliderProps;

const CustomSlider = styled(Slider)({
    "& .MuiSlider-thumb": {
        color: "#3DABF7 !important",
        "&:hover, &:focus, &.Mui-active": {
            boxShadow: "0 0 0 8px rgba(61, 171, 247, 0.16)",
        },
    },
    "& .MuiSlider-track": {
        color: "#3DABF7 !important",
        backgroundColor: "#3DABF7 !important",
    },
    "& .MuiSlider-rail": {
        color: "#000000",
    },
});

export const RangeSlider: FC<RangeSliderProps> = ({
    minDistanсe = 0,
    value,
    onValueChange,
    track,
    marks,
    min = 0,
    max = 0,
    ...restRangeSliderProps
}) => {
    const formatMonthDay = useFormatMonthDay();
    const handleChange = useCallback(
        (e: Event, newValue: number | number[], activeThumb: number) => {
            if (!Array.isArray(newValue) || !value) {
                return;
            }

            if (activeThumb === 0) {
                onValueChange?.([Math.min(newValue[0], value[1] - minDistanсe), value[1]]);
            } else {
                onValueChange?.([value[0], Math.max(newValue[1], value[0] + minDistanсe)]);
            }
        },
        [minDistanсe, onValueChange, value],
    );

    return (
        <CustomSlider
            getAriaLabel={() => "Minimum distance shift"}
            value={value}
            track={track}
            onChange={handleChange}
            marks={marks}
            min={min}
            max={max}
            valueLabelDisplay="on"
            valueLabelFormat={formatMonthDay}
            disableSwap
            {...restRangeSliderProps}
        />
    );
};
