import { Box, FormControlLabel, Typography } from "@mui/material";

import { memo, useCallback, useState } from "react";
import Switch from "@/shared/ui/Switch/Switch";
import DateInput from "@/shared/ui/DateInput/DateInput";

import styles from "./OfferWhenRequests.module.scss";

interface OfferWhenRequestsProps {

}

export const OfferWhenRequests = memo(({ }: OfferWhenRequestsProps) => {
    // const [value, setValue] = useState(false);

    const handleChange = useCallback(() => {}, []);

    return (
        <Box className={styles.dateOfEndContainer} sx={{ marginTop: "30px" }}>
            <Typography className={styles.dateOfEnd}>
                Дата окончания приема заявок
            </Typography>
            <Box className={styles.noDateContainer}>
                <DateInput />
                <FormControlLabel
                    className={styles.noDate}
                    value={}
                    label={(
                        <Typography className={styles.noDateText}>
                            Нет даты окончания
                        </Typography>
                    )}
                    control={<Switch />}
                />
            </Box>
        </Box>
    );
});
