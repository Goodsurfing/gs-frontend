import {
    memo, useState, useCallback, ChangeEvent,
} from "react";
import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography";

import { Mark, RangeSlider } from "@/shared/ui/RangeSlider/RangeSlider";
import Input from "@/shared/ui/Input/Input";

import styles from "./OfferWhenSlider.module.scss";

const initialDate: number[] = [7, 186];

const marks: Mark[] = [{
    value: 1,
    label: "1 день",
}, {
    value: 7,
    label: "7 дней",
}, {
    value: 14,
    label: "14 дней",
}, {
    value: 30,
    label: "1 месяц",
}, {
    value: 62,
    label: "2 месяца",
}, {
    value: 93,
    label: "3 месяца",
}, {
    value: 124,
    label: "4 месяца",
}, {
    value: 155,
    label: "5 месяцев",
}, {
    value: 186,
    label: "6 месяцев",
}];

export const OfferWhenSlider = memo(() => {
    const [sliderValue, setSliderValue] = useState(initialDate);

    const handleStartDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value < 1 || +e.target.value >= sliderValue[1]) {
            return false;
        }

        setSliderValue((prev) => [+e.target.value, prev[1]]);
    }, [sliderValue]);

    const handleEndDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value < 2 || +e.target.value <= sliderValue[0]) {
            return false;
        }

        setSliderValue((prev) => [prev[0], +e.target.value]);
    }, [sliderValue]);

    return (
        <Box className={styles.wrapper}>
            <Typography className={styles.helpText}>
                Срок участия (от-до)
            </Typography>
            <Box className={styles.innerWrapper}>
                <Input onChange={handleStartDateChange} value={sliderValue[0]} type="number" className={styles.input} placeholder="от" />
                <Box className={styles.sliderWrapper}>
                    <RangeSlider
                        className={styles.slider}
                        onValueChange={setSliderValue}
                        value={sliderValue}
                        marks={marks}
                        min={1}
                        max={190}
                    />
                </Box>
                <Input value={sliderValue[1]} onChange={handleEndDateChange} type="number" className={styles.input} placeholder="до" />
            </Box>
        </Box>
    );
});
