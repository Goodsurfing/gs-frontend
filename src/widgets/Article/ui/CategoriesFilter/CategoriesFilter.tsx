import React, { FC, MouseEvent } from "react";
import { ToggleButtonGroup } from "@mui/material";
import cn from "classnames";
import { ToggleButtonComponent } from "@/shared/ui/ToggleButton/ToggleButtonComponent";
import { tags } from "../../model/data/tags.data";
import styles from "./CategoriesFilter.module.scss";

interface CategoriesFilterProps {
    className?: string;
    value: string;
    onChange: (event: MouseEvent<HTMLElement>, value: any) => void;
}

export const CategoriesFilter: FC<CategoriesFilterProps> = (props) => {
    const { className, value, onChange } = props;

    return (
        <div className={cn(className, styles.wrapper)}>
            <span className={styles.title}>Категория</span>
            <ToggleButtonGroup
                value={value}
                onChange={onChange}
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
