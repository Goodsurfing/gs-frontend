import React, { FC, useState } from "react";
import { ToggleButtonGroup } from "@mui/material";
import cn from "classnames";
import { ToggleButtonComponent } from "@/shared/ui/ToggleButton/ToggleButtonComponent";
import { tags } from "../../model/data/tags";
import styles from "./Category.module.scss";

interface CategoryProps {
    className?: string;
}

export const Category: FC<CategoryProps> = (props) => {
    const { className } = props;
    const [categoryValue, setCategoryValue] = useState("Все категории");

    const handleCategoryChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
        if (newValue) setCategoryValue(newValue);
    };

    return (
        <div className={cn(className, styles.wrapper)}>
            <span className={styles.title}>Категория</span>
            <ToggleButtonGroup
                value={categoryValue}
                onChange={handleCategoryChange}
                exclusive
                sx={{
                    display: "flex", flexWrap: "wrap", maxWidth: "624px", gap: "10px", mt: "14px",
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

                            "&.Mui-selected:hover": {
                                cursor: "pointer",
                                border: item.color,
                                borderRadius: "26px",
                                borderWidth: "2px",
                                borderStyle: "solid",
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
                        btncolor={item.color}
                        key={index}
                        value={item.value}
                    >
                        {item.text}
                    </ToggleButtonComponent>
                ))}
            </ToggleButtonGroup>
        </div>
    );
};
