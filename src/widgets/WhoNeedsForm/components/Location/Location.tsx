import Switch from "shared/ui/Switch/Switch";
import { FormControlLabel, Typography } from "@mui/material";

import styles from "./Location.module.scss";

const Location = () => (
    <div className={styles.wrapper}>
        <p className={styles.title}>Откуда принимаю волонтеров</p>
        <div className={styles.container}>
            <FormControlLabel
                label={(
                    <Typography
                        sx={{
                          fontFamily: "Lato",
                          fontWeight: "400",
                          fontSize: "16px",
                          color: "#212121",
                        }}
                    >
                        Не важно
                    </Typography>
                      )}
                control={<Switch />}
            />
            <FormControlLabel
                label={(
                    <Typography
                        sx={{
                          fontFamily: "Lato",
                          fontWeight: "400",
                          fontSize: "16px",
                          color: "#212121",
                        }}
                    >
                        Только иностранцев
                    </Typography>
                      )}
                control={<Switch />}
            />
            <FormControlLabel
                label={(
                    <Typography
                        sx={{
                          fontFamily: "Lato",
                          fontWeight: "400",
                          fontSize: "16px",
                          color: "#212121",
                        }}
                    >
                        Только из моей страны
                    </Typography>
                      )}
                control={<Switch />}
            />
        </div>
    </div>
);

export default Location;
