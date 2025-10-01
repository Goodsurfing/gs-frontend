import { memo, useCallback } from "react";

import Box from "@mui/material/Box/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography/Typography";

import { useTranslation } from "react-i18next";
import { UseFormSetValue } from "react-hook-form";
import SwitchComponent from "@/shared/ui/Switch/Switch";

import styles from "./OfferWhenTimeSettings.module.scss";
import { DatePeriods, EndSettings, TimeSettingsControls } from "../../model/types/offerWhen";

interface OfferWhenTimeSettingsProps {
    value: TimeSettingsControls;
    onChange: (value: TimeSettingsControls) => void;
    periods: DatePeriods[];
    endSettings?: EndSettings;
    setValue: UseFormSetValue<any>;
}

export const OfferWhenTimeSettings = memo(({
    value, onChange, periods, endSettings, setValue,
}: OfferWhenTimeSettingsProps) => {
    const { t } = useTranslation("offer");

    const handleFullYearChange = useCallback(() => {
        onChange({ ...value, isFullYearAcceptable: !value.isFullYearAcceptable });
    }, [onChange, value]);

    const handleEndAccepatableChange = useCallback(() => {
        onChange({ ...value, isApplicableAtTheEnd: !value.isApplicableAtTheEnd });
        if (value.isApplicableAtTheEnd || !endSettings?.isWithoutApplicationDate) {
            const lastPeriod = periods[periods.length - 1];
            const newApplicationEndDate = lastPeriod?.end || new Date();
            if (
                endSettings?.applicationEndDate?.getTime()
                    !== newApplicationEndDate.getTime()
                || endSettings?.isWithoutApplicationDate
            ) {
                setValue("endSettings", {
                    isWithoutApplicationDate: true,
                    applicationEndDate: undefined,
                });
            }
        }
    }, [endSettings, onChange, periods, setValue, value]);

    return (
        <Box className={styles.wrapper}>
            <FormControlLabel
                label={(
                    <Typography className={styles.checkbox}>
                        {t("when.Принимаю круглый год")}
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        checked={value.isFullYearAcceptable}
                        onChange={handleFullYearChange}
                    />
                )}
            />
            <FormControlLabel
                label={(
                    <Typography className={styles.checkbox}>
                        {t("when.Принимаю в последний момент")}
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        checked={value.isApplicableAtTheEnd}
                        onChange={handleEndAccepatableChange}
                    />
                )}
            />
        </Box>
    );
});
