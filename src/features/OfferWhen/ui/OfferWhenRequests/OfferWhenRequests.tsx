import { Box, FormControlLabel, Typography } from "@mui/material";

import { memo } from "react";
import { useTranslation } from "react-i18next";
import Switch from "@/shared/ui/Switch/Switch";
import DateInput from "@/shared/ui/DateInput/DateInput";

import styles from "./OfferWhenRequests.module.scss";
import { EndSettings } from "../../model/types/offerWhen";

interface OfferWhenRequestsProps {
    value: EndSettings;
    onChange: (value: EndSettings) => void;
}

export const OfferWhenRequests = memo(({ onChange, value }: OfferWhenRequestsProps) => {
    const { t } = useTranslation("offer");
    const handleEndDateChange = (date: Date) => {
        onChange({ ...value, applicationEndDate: date });
    };

    const handleNoEndDateLabelChange = () => {
        onChange({ ...value, isWithoutApplicationDate: true });
    };

    return (
        <Box className={styles.dateOfEndContainer}>
            <Typography className={styles.dateOfEnd}>
                {t("when.Дата окончания приема заявок")}
            </Typography>
            <Box className={styles.noDateContainer}>
                <DateInput onDateChange={handleEndDateChange} value={value.applicationEndDate} />
                <FormControlLabel
                    className={styles.noDate}
                    label={(
                        <Typography className={styles.noDateText}>
                            {t("when.Нет даты окончания")}
                        </Typography>
                    )}
                    control={<Switch onClick={handleNoEndDateLabelChange} />}
                />
            </Box>
        </Box>
    );
});
