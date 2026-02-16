import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { FC, MouseEvent } from "react";

import styles from "./OfferCategories.module.scss";
import { useGetPublicCategoriesVacancyQuery } from "@/entities/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

interface OfferCategoriesProps {
    value?: number | number[];
    onChange?: (value: number | number[]) => void;
    maxLength?: number;
    locale: Locale;
    exclusive?: boolean;
}

export const OfferCategories: FC<OfferCategoriesProps> = (props) => {
    const {
        value,
        onChange,
        maxLength = 5,
        locale,
        exclusive = false,
    } = props;

    const {
        data: categoriesData,
        isLoading,
    } = useGetPublicCategoriesVacancyQuery({ lang: locale });

    const handleChange = (
        event: MouseEvent<HTMLElement>,
        newValues: number | number[],
    ) => {
        if (exclusive) {
            const newValue = newValues as number | null;
            if (newValue !== null) {
                onChange?.(newValue);
            }
        } else {
            const valuesArray = newValues as number[];
            if (valuesArray.length <= maxLength) {
                onChange?.(valuesArray.filter((id) => id > 0));
            }
        }
    };

    const groupValue = exclusive && Array.isArray(value) ? value[0] : value;

    if (isLoading) {
        return (
            <div className={styles.container}>
                <MiniLoader />
            </div>
        );
    }

    if (!categoriesData) {
        return null;
    }

    return (
        <div className={styles.container}>
            <ToggleButtonGroup
                value={groupValue}
                onChange={handleChange}
                exclusive={exclusive}
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    maxWidth: "624px",
                    gap: "10px",
                }}
            >
                {categoriesData.map((item, index) => (
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
                                backgroundColor: "transparent",
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
                        value={item.id}
                    >
                        {item.name}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </div>
    );
};
