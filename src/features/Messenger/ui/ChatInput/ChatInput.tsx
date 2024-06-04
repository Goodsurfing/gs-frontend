import React, { FC } from "react";
import {
    IconButton, InputBase, Paper, SxProps, Theme,
} from "@mui/material";
import { ReactSVG } from "react-svg";
import clipIcon from "@/shared/assets/icons/clip.svg";
import smileIcon from "@/shared/assets/icons/textEditor/smile.svg";
import sendIcon from "@/shared/assets/icons/send-arrow.svg";

import styles from "./ChatInput.module.scss";

interface ChatInputProps {
    sx?: SxProps<Theme>;
}

export const ChatInput: FC<ChatInputProps> = (props) => {
    const { sx } = props;
    return (
        <div className={styles.wrapper}>
            <Paper
                component="form"
                sx={{
                    p: "10px 14px",
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
                <IconButton aria-label="menu" className={styles.button}>
                    <ReactSVG src={clipIcon} className={styles.clip} />
                </IconButton>
                <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Написать сообщение" />
                <IconButton aria-label="menu" className={styles.button}>
                    <ReactSVG src={smileIcon} className={styles.icon} />
                </IconButton>
            </Paper>
            <IconButton aria-label="menu" className={styles.button}>
                <ReactSVG src={sendIcon} className={styles.icon} />
            </IconButton>
        </div>
    );
};
