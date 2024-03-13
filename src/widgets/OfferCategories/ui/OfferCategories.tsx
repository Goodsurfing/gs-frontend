import React, { FC, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import ToggleButtonGroupComponent from "@/components/ToggleButtonGroup/ToggleButtonGroup";

import { ToggleButtonComponent } from "@/shared/ui/ToggleButton/ToggleButtonComponent";

import { useTags } from "./OfferCategories.data";
import styles from "./OfferCategories.module.scss";

interface OfferCategoriesProps {
    value?: string[];
    onChange?: (value: string[]) => void;
}

export const OfferCategories: FC<OfferCategoriesProps> = (props) => {
    const { value, onChange } = props;
    const { tags } = useTags();

    const handleChange = (event: ChangeEvent<{}>, newValues: string[]) => {
        onChange?.(newValues.filter(Boolean));
    };

    return (
        <div className={styles.container}>
            <ToggleButtonGroupComponent
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
                {tags.map((item, index) => (
                    <ToggleButtonComponent
                        sx={{
                            maxHeight: "35px",
                            padding: "5px 10px",
                            border: item.color,
                            borderRadius: "26px",
                            borderWidth: "2px",
                            borderStyle: "solid",
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
                        }}
                        btncolor={item.color}
                        key={index}
                        value={item.value}
                    >
                        {item.text}
                    </ToggleButtonComponent>
                ))}
            </ToggleButtonGroupComponent>
        </div>
    );
};
