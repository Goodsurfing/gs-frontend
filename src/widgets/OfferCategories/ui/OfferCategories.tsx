import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, {
    ChangeEvent, FC,
} from "react";

import { useCategories } from "@/shared/data/categories";
import styles from "./OfferCategories.module.scss";

interface OfferCategoriesProps {
    value?: string[];
    onChange?: (value: string[]) => void;
    maxLength?: number;
}

export const OfferCategories: FC<OfferCategoriesProps> = (props) => {
    const { value, onChange, maxLength = 5 } = props;
    const { tags } = useCategories();

    const handleChange = (event: ChangeEvent<{}>, newValues: string[]) => {
        if (newValues.length <= maxLength) {
            onChange?.(newValues.filter(Boolean));
        }
    };

    return (
        <div className={styles.container}>
            <ToggleButtonGroup
                value={value}
                onChange={handleChange}
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    maxWidth: "624px",
                    gap: "10px",
                }}
            >
                {tags.map((item, index) => (
                    <ToggleButton
                        sx={{
                            maxHeight: "35px",
                            padding: "5px 10px",
                            border: `${item.color} !important`,
                            borderRadius: "26px !important",
                            borderWidth: "2px !important",
                            borderStyle: "solid !important",
                            boxSizing: "content-box",
                            textTransform: "none",
                            color: "#212121",
                            fontSize: "14px",
                            fontFamily: "Lato",

                            "&:hover": {
                                cursor: "pointer",
                                border: item.color,
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
                                border: item.color,
                                borderRadius: "26px",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                outline: "none",
                            },
                            "&.Mui-selected": {
                                backgroundColor: item.color,
                            },
                            "&.Mui-selected:hover": {
                                backgroundColor: item.color,
                            },
                        }}
                        key={index}
                        value={item.value}
                    >
                        {item.text}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </div>
    );
};
