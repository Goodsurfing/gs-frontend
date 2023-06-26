import { Slider } from "@mui/material";
import { SliderProps } from "@mui/material/Slider";
import React, { FC, useCallback, useState } from "react";

import { formatMonthDay } from "@/shared/utils/date/formatMonthDay";

type IRangeSlider = {
    minDistanсe?: number;
    value?: number[];
    min?: number;
    max?: number;
    onValueChange?: (value?: number | number[]) => void;
} & SliderProps;

const RangeSlider: FC<IRangeSlider> = ({
    minDistanсe = 10, value, onValueChange, min = 0, max = 0, ...restRangeSliderProps
}) => {
    const [sliderValue, setSliderValue] = useState<number[]>([14, 28]);

    const handleChange = useCallback((
        e: Event,
        newValue: number | number[],
        activeThumb: number,
    ) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setSliderValue([Math.min(newValue[0], sliderValue[1] - minDistanсe), sliderValue[1]]);
        } else {
            setSliderValue([sliderValue[0], Math.max(newValue[1], sliderValue[0] + minDistanсe)]);
        }

        if (onValueChange) {
            onValueChange(sliderValue);
        }
    }, [minDistanсe, onValueChange, sliderValue]);

    return (
        <Slider
            getAriaLabel={() => { return "Minimum distance shift"; }}
            value={sliderValue}
            onChange={handleChange}
            min={min}
            max={max}
            valueLabelDisplay="on"
            valueLabelFormat={formatMonthDay}
            disableSwap

            {...restRangeSliderProps}
        />
    );
};

export default React.memo(RangeSlider);
