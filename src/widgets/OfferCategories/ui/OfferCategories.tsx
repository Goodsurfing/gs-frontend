import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, {
    ChangeEvent, FC,
} from "react";

import styles from "./OfferCategories.module.scss";
import { useGetPublicCategoriesVacancyQuery } from "@/entities/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

interface OfferCategoriesProps {
    value?: number[];
    onChange?: (value: number[]) => void;
    maxLength?: number;
    locale: Locale;
}

export const OfferCategories: FC<OfferCategoriesProps> = (props) => {
    const {
        value, onChange, maxLength = 5, locale,
    } = props;
    const {
        data: categoriesData,
        isLoading,
    } = useGetPublicCategoriesVacancyQuery({ lang: locale });

    const handleChange = (event: ChangeEvent<{}>, newValues: number[]) => {
        if (newValues.length <= maxLength) {
            onChange?.(newValues.filter((id) => id > 0));
        }
    };

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
                value={value}
                onChange={handleChange}
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
                                backgrounColor: "transparent",
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
