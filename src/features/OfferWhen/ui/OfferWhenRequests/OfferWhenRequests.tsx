import { Box, FormControlLabel, Typography } from "@mui/material";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Switch from "@/shared/ui/Switch/Switch";
import DateInput from "@/shared/ui/DateInput/DateInput";

import styles from "./OfferWhenRequests.module.scss";
import { EndSettings } from "../../model/types/offerWhen";

interface OfferWhenRequestsProps {
    value: EndSettings;
    onChange: (value: EndSettings) => void;
    isApplicableAtTheEnd: boolean;
}

export const OfferWhenRequests = ({
    onChange, value,
    isApplicableAtTheEnd,
}: OfferWhenRequestsProps) => {
    const { t } = useTranslation("offer");

    const handleEndDateChange = useCallback((date: Date) => {
        if (!value.isWithoutApplicationDate) {
            onChange({ ...value, applicationEndDate: date });
        }
    }, [onChange, value]);

    const handleNoEndDateLabelChange = useCallback(() => {
        if (!isApplicableAtTheEnd) {
            const newIsWithoutApplicationDate = !value.isWithoutApplicationDate;
            const newApplicationEndDate = newIsWithoutApplicationDate ? undefined : new Date();
            onChange({
                ...value,
                isWithoutApplicationDate: newIsWithoutApplicationDate,
                applicationEndDate: newApplicationEndDate,
            });
        }
    }, [isApplicableAtTheEnd, onChange, value]);

    return (
        <Box className={styles.dateOfEndContainer}>
            <Typography className={styles.dateOfEnd}>
                {t("when.Дата окончания приема заявок")}
            </Typography>
            <Box className={styles.noDateContainer}>
                <DateInput
                    onDateChange={handleEndDateChange}
                    value={value.applicationEndDate}
                    inputDisabled={value.isWithoutApplicationDate}
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
};
