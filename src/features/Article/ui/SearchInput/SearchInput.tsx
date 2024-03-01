import React, { FC } from "react";
import { HandySvg } from "@handy-ones/handy-svg";
import {
    IconButton, InputBase, Paper, SxProps, Theme,
} from "@mui/material";
import searchIcon from "@/shared/assets/icons/search-icon.svg";

import styles from "./SearchInput.module.scss";

interface SearchInputProps {
    sx?: SxProps<Theme>;
}

export const SearchInput: FC<SearchInputProps> = (props) => {
    const { sx } = props;
    return (
        <Paper
            component="form"
            sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                minwidth: 150,
                width: "100%",
                boxShadow: "none",
                border: "1px solid var(--text-caption)",
                borderRadius: "10px",
                ...sx,
            }}
        >
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Поиск" />
            <IconButton aria-label="menu" className={styles.searchIcon}>
                <HandySvg src={searchIcon} className={styles.searchIcon} />
            </IconButton>
        </Paper>
    );
};
