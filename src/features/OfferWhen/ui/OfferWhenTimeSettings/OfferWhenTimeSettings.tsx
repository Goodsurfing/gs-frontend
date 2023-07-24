import { memo } from "react";

import Box from "@mui/material/Box/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography/Typography";

import SwitchComponent from "@/shared/ui/Switch/Switch";

import styles from "./OfferWhenTimeSettings.module.scss";
import { TimeSettingsControls } from "../../model/types/offerWhen";

interface OfferWhenTimeSettingsProps {
    value: TimeSettingsControls;
    onChange: (value: TimeSettingsControls) => void;
}

export const OfferWhenTimeSettings = memo(({ value, onChange }: OfferWhenTimeSettingsProps) => {
    const handleFullYearChange = () => {
        onChange({ ...value, isFullYearAcceptable: !value.isFullYearAcceptable });
    };

    const handleEndAccepatableChange = () => {
        onChange({ ...value, isApplicableAtTheEnd: !value.isApplicableAtTheEnd });
    };
    return (
        <Box className={styles.wrapper}>
            <FormControlLabel
                label={(
                    <Typography className={styles.checkbox}>
                        Принимаю круглый год
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        value={value.isFullYearAcceptable}
                        onClick={handleFullYearChange}
                    />
                )}
            />
            <FormControlLabel
                label={(
                    <Typography className={styles.checkbox}>
                        Принимаю в последний момент
                    </Typography>
                )}
                control={(
                    <SwitchComponent
                        value={value.isApplicableAtTheEnd}
                        onClick={handleEndAccepatableChange}
                    />
                )}
            />
        </Box>
    );
});
