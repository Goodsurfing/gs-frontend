import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { FC, MouseEvent } from "react";

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { useGetBlogCategoriesQuery } from "@/entities/Blog";
import styles from "./BlogCategories.module.scss";

interface BlogCategoriesProps {
    value?: number | number[];
    onChange?: (value?: number | number[]) => void;
    maxLength?: number;
    locale: Locale;
    exclusive?: boolean;
}

export const BlogCategories: FC<BlogCategoriesProps> = (props) => {
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
    } = useGetBlogCategoriesQuery({ lang: locale });

    const handleChange = (
        event: MouseEvent<HTMLElement>,
        newValues: number | number[],
    ) => {
        if (exclusive) {
            const newValue = newValues as number | undefined;
            onChange?.(newValue);
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
                {categoriesData.map((item, index) => {
                    const color = item.color === "" ? "#3DABF7" : item.color;

                    return (
                        <ToggleButton
                            sx={{
                                maxHeight: "35px",
                                padding: "5px 10px",
                                border: `${color} !important`,
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
                                    border: color,
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
                                    border: color,
                                    borderRadius: "26px",
                                    borderWidth: "2px",
                                    borderStyle: "solid",
                                    outline: "none",
                                },
                                "&.Mui-selected": {
                                    backgroundColor: color,
                                },
                                "&.Mui-selected:hover": {
                                    backgroundColor: color,
                                },
                            }}
                            key={index}
                            value={item.id}
                        >
                            {item.name}
                        </ToggleButton>
                    );
                })}
            </ToggleButtonGroup>
        </div>
    );
};
