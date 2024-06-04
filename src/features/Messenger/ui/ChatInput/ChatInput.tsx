import {
    IconButton, InputBase, Paper, SxProps, Theme,
} from "@mui/material";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import React, { FC, useRef, useState } from "react";
import { ReactSVG } from "react-svg";

import clipIcon from "@/shared/assets/icons/clip.svg";
import sendIcon from "@/shared/assets/icons/send-arrow.svg";
import smileIcon from "@/shared/assets/icons/chat-smile.svg";

import styles from "./ChatInput.module.scss";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

interface ChatInputProps {
    sx?: SxProps<Theme>;
}

export const ChatInput: FC<ChatInputProps> = (props) => {
    const { sx } = props;
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const emojiRef = useRef(null);

    useOnClickOutside(emojiRef, () => setShowEmojiPicker(() => false));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function onEmojiClick(emoji: EmojiClickData, event: MouseEvent): void {
    }

    return (
        <div className={styles.wrapper}>
            <Paper
                component="form"
                onClick={(event) => {
                    event.stopPropagation();
                }}
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
                    <ReactSVG src={clipIcon} className={styles.icon} />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Написать сообщение"
                />
                <IconButton
                    ref={emojiRef}
                    aria-label="menu"
                    className={styles.button}
                    onClick={() => {
                        setShowEmojiPicker((prev) => !prev);
                    }}
                >
                    <ReactSVG src={smileIcon} className={styles.icon} />
                    {showEmojiPicker && (
                        <div
                            className={styles.emojiWrapper}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <EmojiPicker
                                onEmojiClick={(emoji, event) => onEmojiClick(emoji, event)}
                                lazyLoadEmojis
                            />
                        </div>
                    )}
                </IconButton>
            </Paper>
            <IconButton aria-label="menu" className={styles.send}>
                <ReactSVG src={sendIcon} className={styles.icon} />
            </IconButton>
        </div>
    );
};
