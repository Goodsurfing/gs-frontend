import { memo } from "react";

import Box from "@mui/material/Box/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography/Typography";

import SwitchComponent from "@/shared/ui/Switch/Switch";

import styles from "./OfferWhenTimeSettings.module.scss";

interface OfferWhenTimeSettingsProps {

}

export const OfferWhenTimeSettings = memo(({}: OfferWhenTimeSettingsProps) => (
    <Box sx={{ display: "flex", mt: "30px" }}>
        <FormControlLabel
            label={(
                <Typography className={styles.checkbox}>
                    Принимаю круглый год
                </Typography>
            )}
            control={<SwitchComponent />}
        />
        <FormControlLabel
            label={(
                <Typography className={styles.checkbox}>
                    Принимаю в последний момент
                </Typography>
            )}
            control={<SwitchComponent />}
        />
    </Box>
));
