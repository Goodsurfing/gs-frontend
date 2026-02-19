import React, { FC, useEffect } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { TagsOption, useFilterTags } from "../../model/data/tags";

interface FilterProps {
    value: TagsOption;
    onChange: (value: TagsOption) => void;
}

export const Filter: FC<FilterProps> = (props) => {
    const { value, onChange } = props;
    const tags = useFilterTags();

    const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newValue: TagsOption) => {
        if (newValue) onChange(newValue);
    };

    useEffect(() => {});

    return (
        <div>
            <ToggleButtonGroup
                onChange={handleFilterChange}
                exclusive
                value={value}
                sx={{
                    display: "flex", flexWrap: "wrap", maxWidth: "624px", gap: "10px",
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
