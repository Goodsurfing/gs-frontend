import React, { ChangeEvent, FC } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import styles from "./LanguagesGroup.module.scss";
import { useAllLangsFilter } from "@/shared/data/languages";

interface LanguagesGroupProps {
    value: string[];
    onChange: (value: string[]) => void
}

export const LanguagesGroup: FC<LanguagesGroupProps> = (props) => {
    const { value, onChange } = props;
    const allLangsFilter = useAllLangsFilter();

    const handleChange = (event: ChangeEvent<{}>, newValues: string[]) => {
        onChange(newValues.filter(Boolean));
    };

    return (
        <div className={styles.wrapper}>
            <ToggleButtonGroup
                value={value}
                onChange={handleChange}
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    maxWidth: "624px",
                    gap: "10px",
                    mt: "14px",
                }}
            >
                {allLangsFilter.map((item, index) => (
                    <ToggleButton
                        sx={{
                            maxHeight: "35px",
                            padding: "5px 10px",
                            backgroundColor: "var(--bg-field)",
                            border: "none !important",
                            borderRadius: "26px !important",
                            boxSizing: "content-box",
                            textTransform: "none",
                            color: "#212121",
                            fontSize: "14px",
                            fontFamily: "Lato",

                            "&:hover": {
                                cursor: "pointer",
                                border: "var(--bg-field)",
                                borderRadius: "26px",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                outline: "none",
                            },

                            "&:selected:hover": {
                                backgrounColor: "none",
                            },

                            "&:selected": {
                                cursor: "pointer",
                                border: "var(--accent-color)",
                                borderRadius: "26px",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                outline: "none",
                            },
                            "&.Mui-selected": {
                                backgroundColor: "var(--accent-color)",
                                color: "var(--bg-primary-1)",
                                border: "none !important",
                            },
                            "&.Mui-selected:hover": {
                                backgroundColor: "var(--accent-color)",
                                color: "var(--bg-primary-1)",
                            },
                        }}
                        key={index}
                        value={item.value}
                    >
                        {item.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </div>
    );
};
