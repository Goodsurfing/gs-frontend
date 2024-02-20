import { FormControlLabel, Typography } from "@mui/material";
import { FC } from "react";

import { ReceptionPlace } from "@/entities/Offer";

import Switch from "@/shared/ui/Switch/Switch";

import styles from "./Location.module.scss";

interface LocationProps {
    value: ReceptionPlace;
    onChange: (value: ReceptionPlace) => void;
}

const Location: FC<LocationProps> = (props) => {
    const { value, onChange } = props;

    const handleChange = (newValue: ReceptionPlace) => {
        // setSelectedValue(newValue);
        onChange(newValue);
    };

    return (
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
                    control={<Switch checked={value === "any"} onChange={() => handleChange("any")} />}
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
                    control={<Switch checked={value === "foreigners"} onChange={() => handleChange("foreigners")} />}
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
                    control={<Switch checked={value === "compatriot"} onChange={() => handleChange("compatriot")} />}
                />
            </div>
        </div>
    );
};

export default Location;
