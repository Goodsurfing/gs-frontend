import { Box, FormControlLabel, Typography } from "@mui/material";

import { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Switch from "@/shared/ui/Switch/Switch";
import DateInput from "@/shared/ui/DateInput/DateInput";

import styles from "./OfferWhenRequests.module.scss";
import { DatePeriods, EndSettings } from "../../model/types/offerWhen";

interface OfferWhenRequestsProps {
    value: EndSettings;
    onChange: (value: EndSettings) => void;
    isApplicableAtTheEnd: boolean;
    periods: DatePeriods[];
}

export const OfferWhenRequests = memo(({
    onChange, value,
    isApplicableAtTheEnd, periods,
}: OfferWhenRequestsProps) => {
    const { t } = useTranslation("offer");
    const handleEndDateChange = (date: Date) => {
        if (!value.isWithoutApplicationDate) {
            onChange({ ...value, applicationEndDate: date });
        }
    };

    const handleNoEndDateLabelChange = () => {
        if (!isApplicableAtTheEnd) {
            if (value.isWithoutApplicationDate) {
                onChange({
                    ...value,
                    isWithoutApplicationDate: !value.isWithoutApplicationDate,
                    applicationEndDate: new Date(),
                });
            } else {
                onChange({
                    ...value,
                    isWithoutApplicationDate: !value.isWithoutApplicationDate,
                    applicationEndDate: undefined,
                });
            }
        }
    };

    useEffect(() => {
        if (isApplicableAtTheEnd) {
            if ((periods.length > 0)
            && (periods[0].start !== undefined && periods[0].end !== undefined)) {
                const lastPeriod = periods[periods.length - 1];
                onChange({
                    ...value,
                    isWithoutApplicationDate: false,
                    applicationEndDate: lastPeriod.end,
                });
            } else {
                onChange({
                    ...value,
                    isWithoutApplicationDate: false,
                    applicationEndDate: new Date(),
                });
            }
        }
    }, [isApplicableAtTheEnd, onChange, periods, value]);

    return (
        <Box className={styles.dateOfEndContainer}>
            <Typography className={styles.dateOfEnd}>
                {t("when.Дата окончания приема заявок")}
            </Typography>
            <Box className={styles.noDateContainer}>
                <DateInput
                    onDateChange={handleEndDateChange}
                    value={value.applicationEndDate}
                    inputDisabled={value.isWithoutApplicationDate || isApplicableAtTheEnd}
                />
                <FormControlLabel
                    className={styles.noDate}
                    label={(
                        <Typography className={styles.noDateText}>
                            {t("when.Нет даты окончания")}
                        </Typography>
                    )}
                    control={(
                        <Switch
                            onClick={handleNoEndDateLabelChange}
                            checked={value.isWithoutApplicationDate}
                        />
                    )}
                />
            </Box>
        </Box>
    );
});
