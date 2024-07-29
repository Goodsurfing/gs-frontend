import React, { FC } from "react";
import {
    IconButton, InputBase, Paper, SxProps, Theme,
} from "@mui/material";
import { ReactSVG } from "react-svg";
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
                p: "4px 6px",
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
                <ReactSVG src={searchIcon} className={styles.searchIconSVG} />
            </IconButton>
        </Paper>
    );
};
