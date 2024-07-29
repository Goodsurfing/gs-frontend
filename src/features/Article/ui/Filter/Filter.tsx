import React, { useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { TagsOption, tags } from "../../model/data/tags";

export const Filter = () => {
    const [filterValue, setFilterValue] = useState<TagsOption>("Свежее");

    const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newValue: TagsOption) => {
        if (newValue) setFilterValue(newValue);
    };

    useEffect(() => {});

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
                    <ToggleButton
                        sx={{
                            maxHeight: "35px",
                            padding: "5px 10px",
                            border: "var(--text-caption) !important",
                            borderRadius: "26px !important",
                            borderWidth: "1px !important",
                            borderStyle: "solid !important",
                            boxSizing: "content-box",
                            textTransform: "none",
                            color: "#212121",
                            fontSize: "14px",
                            fontFamily: "Lato",

                            "&:hover": {
                                cursor: "pointer",
                                border: "var(--text-caption) !important",
                                borderRadius: "26px !important",
                                borderWidth: "1px !important",
                                borderStyle: "solid !important",
                                outline: "none",
                            },
                            "&.Mui-selected": {
                                color: "white",
                                border: "var(--text-primary-1) !important",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                backgroundColor: "var(--text-primary-1) !important",
                            },
                            "&.Mui-selected:hover": {
                                color: "white",
                                border: "var(--text-primary-1) !important",
                                borderWidth: "2px",
                                borderStyle: "solid",
                                backgroundColor: "var(--text-primary-1) !important",
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
