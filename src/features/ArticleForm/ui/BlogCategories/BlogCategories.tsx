import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { FC, MouseEvent } from "react";

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { useGetBlogCategoriesQuery } from "@/entities/Blog";
import { useGetNewsCategoriesQuery } from "@/entities/News";
import styles from "./BlogCategories.module.scss";

interface BlogCategoriesProps {
    value?: number | number[];
    onChange?: (value?: number | number[]) => void;
    maxLength?: number;
    locale: Locale;
    exclusive?: boolean;
    /** Справочник: категории блога (по умолчанию) или новостей */
    source?: "blog" | "news";
    /** Фильтр списка: число материалов у категории, пустые — бледные и не нажимаются */
    showCounts?: boolean;
}

export const BlogCategories: FC<BlogCategoriesProps> = (props) => {
    const {
        value,
        onChange,
        maxLength = 5,
        locale,
        exclusive = false,
        source = "blog",
        showCounts = false,
    } = props;

    const blog = useGetBlogCategoriesQuery({ lang: locale }, { skip: source !== "blog" });
    const news = useGetNewsCategoriesQuery({ lang: locale }, { skip: source !== "news" });
    const { data: categoriesData, isLoading } = source === "news" ? news : blog;

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
                    const empty = showCounts && item.count === 0 && item.id !== groupValue;

                    return (
                        <ToggleButton
                            sx={{
                                maxHeight: "35px",
                                padding: "5px 10px",
                                border: `2px solid ${color} !important`,
                                borderRadius: "26px !important",
                                boxSizing: "content-box",
                                textTransform: "none",
                                color: "#212121",
                                fontSize: "14px",
                                fontFamily: "Lato",

                                "&:hover": {
                                    cursor: "pointer",
                                    borderColor: color,
                                    borderRadius: "26px",
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
                            disabled={empty}
                            style={empty ? { opacity: 0.45 } : undefined}
                        >
                            {item.name}
                            {showCounts && item.count !== undefined && (
                                <span style={{ marginLeft: 6, color: "#8494a1" }}>{item.count}</span>
                            )}
                        </ToggleButton>
                    );
                })}
            </ToggleButtonGroup>
        </div>
    );
};
