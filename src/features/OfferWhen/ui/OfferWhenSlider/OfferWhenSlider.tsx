import {
    memo, useCallback, ChangeEvent,
} from "react";
import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography";

import { useTranslation } from "react-i18next";
import { Mark, RangeSlider } from "@/shared/ui/RangeSlider/RangeSlider";
import Input from "@/shared/ui/Input/Input";

import styles from "./OfferWhenSlider.module.scss";

interface OfferWhenSliderProps {
    onChange?: (value: number[]) => void;
    value: number[];
}

export const OfferWhenSlider = memo(({ onChange, value }: OfferWhenSliderProps) => {
    const { t } = useTranslation("offer");
    const marks: Mark[] = [{
        value: 1,
        label: t("when.1 день"),
    }, {
        value: 7,
        label: t("when.7 дней"),
    }, {
        value: 14,
        label: t("when.14 дней"),
    }, {
        value: 30,
        label: t("when.1 месяц"),
    }, {
        value: 62,
        label: t("when.2 месяца"),
    }, {
        value: 93,
        label: t("when.3 месяца"),
    }, {
        value: 124,
        label: t("when.4 месяца"),
    }, {
        value: 155,
        label: t("when.5 месяцев"),
    }, {
        value: 186,
        label: t("when.6 месяцев"),
    }];

    const handleStartDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!value || +e.target.value < 1 || +e.target.value >= value[1]) {
            return;
        }

        onChange?.([+e.target.value, value[1]]);
    }, [onChange, value]);

    const handleEndDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!value || +e.target.value < 2 || +e.target.value <= value[0]) {
            return null;
        }
        onChange?.([value[0], +e.target.value]);
    }, [onChange, value]);

    return (
        <Box className={styles.wrapper}>
            <Typography className={styles.helpText}>
                {t("when.Срок участия (от-до)")}
            </Typography>
            <Box className={styles.innerWrapper}>
                <Input onChange={handleStartDateChange} value={value[0]} type="number" className={styles.input} placeholder="от" />
                <Box className={styles.sliderWrapper}>
                    <RangeSlider
                        className={styles.slider}
                        onValueChange={onChange}
                        value={value}
                        marks={marks}
                        min={1}
                        max={190}
                    />
                </Box>
                <Input value={value[1]} onChange={handleEndDateChange} type="number" className={styles.input} placeholder="до" />
            </Box>
        </Box>
    );
});
