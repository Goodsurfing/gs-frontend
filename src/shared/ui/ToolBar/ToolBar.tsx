import { HandySvg } from "@handy-ones/handy-svg";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { type Editor } from "@tiptap/react";
import React, { FC, memo, useState } from "react";

import ArrowLeftIcon from "@/shared/assets/icons/textEditor/Arrows1.svg";
import ArrowRightIcon from "@/shared/assets/icons/textEditor/Arrows2.svg";
import linkIcon from "@/shared/assets/icons/textEditor/Content1.svg";
import smileIcon from "@/shared/assets/icons/textEditor/Content2.svg";
import boldIcon from "@/shared/assets/icons/textEditor/Formatting1.svg";
import italicIcon from "@/shared/assets/icons/textEditor/Formatting2.svg";
import underlineIcon from "@/shared/assets/icons/textEditor/Formatting3.svg";
import alignLeftIcon from "@/shared/assets/icons/textEditor/Paragraph1.svg";
import alignCenterIcon from "@/shared/assets/icons/textEditor/Paragraph2.svg";
import markIcon from "@/shared/assets/icons/textEditor/Paragraph3.svg";
import paragraphIcon from "@/shared/assets/icons/textEditor/Paragraph4.svg";

import styles from "./ToolBar.module.scss";

interface ToolBarProps {
    editor: Editor | null;
}

export const ToolBar: FC<ToolBarProps> = memo((props: ToolBarProps) => {
    const { editor } = props;
    const [format, setFormat] = useState(null);

    if (!editor) {
        return null;
    }

    const handleFormat = (event, newFormat) => {
        setFormat(newFormat);
        switch (newFormat) {
            case "bold":
                editor.chain().toggleBold().run();
                break;
            case "italic":
                editor.chain().toggleItalic().run();
                break;
            case "underlined":
                editor.chain().toggleUnderline().run();
                break;
            default:
                break;
        }
    };

    return (
        <div className={styles.wrapper}>
            <ToggleButtonGroup
                exclusive
                value={format}
                onChange={handleFormat}
                aria-label="text formatting"
                className={styles.groupWrapper}
            >
                <ToggleButton
                    value="bold"
                    aria-label="bold"
                    className={styles.toggleButton}
                >
                    <HandySvg src={boldIcon} />
                </ToggleButton>
                <ToggleButton
                    value="italic"
                    aria-label="italic"
                    className={styles.toggleButton}
                >
                    <HandySvg src={italicIcon} />
                </ToggleButton>
                <ToggleButton
                    value="underlined"
                    aria-label="underlined"
                    className={styles.toggleButton}
                >
                    <HandySvg src={underlineIcon} />
                </ToggleButton>
                {/* <ToggleButton value="color" aria-label="color" disabled>
                    <HandySvg src={}/>
                </ToggleButton> */}
            </ToggleButtonGroup>
        </div>
    );
});
