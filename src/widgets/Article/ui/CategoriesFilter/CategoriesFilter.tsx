import React, { FC, MouseEvent } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import cn from "classnames";
import styles from "./CategoriesFilter.module.scss";
import { useCategories } from "@/shared/data/categories";

interface CategoriesFilterProps {
    className?: string;
    value: string;
    onChange: (event: MouseEvent<HTMLElement>, value: any) => void;
}

export const CategoriesFilter: FC<CategoriesFilterProps> = (props) => {
    const { className, value, onChange } = props;
    const { tags } = useCategories();

    return (
        <div className={cn(className, styles.wrapper)}>
            <span className={styles.title}>Категория</span>
            <ToggleButtonGroup
                className={styles.group}
                value={value}
                onChange={onChange}
                exclusive
                sx={{
                    display: "flex", flexWrap: "wrap", gap: "10px", mt: "14px",
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

                            "&.Mui-selected:hover": {
                                cursor: "pointer",
                                border: item.color,
                                borderRadius: "26px !important",
                                borderWidth: "2px !important",
                                borderStyle: "solid !important",
                                outline: "none",
                                backgroundColor: item.color,
                            },

                            "&.Mui-selected": {
                                cursor: "pointer",
                                border: item.color,
                                borderRadius: "26px",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                outline: "none",
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
