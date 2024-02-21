import React, { useState } from "react";
import { ToggleButtonGroup } from "@mui/material";
import { ToggleButtonComponent } from "@/shared/ui/ToggleButton/ToggleButtonComponent";
import { tags } from "../../model/data/tags";

export const Filter = () => {
    const [filterValue, setFilterValue] = useState("Свежее");

    const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newValue) => {
        if (newValue) setFilterValue(newValue);
    };

    return (
        <div>
            <ToggleButtonGroup
                onChange={handleFilterChange}
                exclusive
                value={filterValue}
                sx={{
                    display: "flex", flexWrap: "wrap", maxWidth: "624px", gap: "10px", mt: "14px",
                }}
            >
                {tags.map((item, index) => (
                    <ToggleButtonComponent
                        sx={{
                            maxHeight: "35px",
                            padding: "5px 10px",
                            border: "var(--text-caption)",
                            borderRadius: "26px",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            boxSizing: "content-box",
                            textTransform: "none",
                            color: "#212121",
                            fontSize: "14px",
                            fontFamily: "Lato",

                            "&.Mui-selected": {
                                color: "white",
                                border: "var(--text-primary-1)",
                                borderWidth: "2px",
                                borderStyle: "solid",
                            },
                            "&.Mui-selected:hover": {
                                color: "white",
                                border: "var(--text-primary-1)",
                                borderWidth: "2px",
                                borderStyle: "solid",
                            },
                        }}
                        btncolor="var(--text-primary-1)"
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
