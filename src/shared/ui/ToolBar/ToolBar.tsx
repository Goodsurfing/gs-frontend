import { HandySvg } from "@handy-ones/handy-svg";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { type Editor } from "@tiptap/react";
import cn from "classnames";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import React, {
    ChangeEvent,
    FC,
    MouseEvent,
    memo,
    useRef,
    useState,
} from "react";

import ArrowLeftIcon from "@/shared/assets/icons/textEditor/arrowLeft.svg";
import linkIcon from "@/shared/assets/icons/textEditor/link.svg";
import smileIcon from "@/shared/assets/icons/textEditor/smile.svg";
import boldIcon from "@/shared/assets/icons/textEditor/bold.svg";
import italicIcon from "@/shared/assets/icons/textEditor/italic.svg";
import underlineIcon from "@/shared/assets/icons/textEditor/underline.svg";
import alignLeftIcon from "@/shared/assets/icons/textEditor/alignLeft.svg";
import alignCenterIcon from "@/shared/assets/icons/textEditor/alignCenter.svg";
import orderedListIcon from "@/shared/assets/icons/textEditor/orderedList.svg";
import bulletListIcon from "@/shared/assets/icons/textEditor/bulletList.svg";
import imageIcon from "@/shared/assets/icons/textEditor/image.svg";
import alignJustifyIcon from "@/shared/assets/icons/textEditor/alignJustify.svg";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import InputFile from "../InputFile/InputFile";
import styles from "./ToolBar.module.scss";

interface ToolBarProps {
    editor: Editor | null;
}

export const ToolBar: FC<ToolBarProps> = memo((props: ToolBarProps) => {
    const { editor } = props;
    const [alignText, setAlignText] = useState<string | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [undo, setUndo] = useState(false);
    const [redo, setRedo] = useState(false);
    const emojiRef = useRef(null);

    useOnClickOutside(emojiRef, () => setShowEmojiPicker((prev) => !prev));

    if (!editor) {
        return null;
    }

    const addImage = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            const url = URL.createObjectURL(file);
            editor?.chain().focus().setImage({ src: url }).run();
            e.target.value = "";
        }
    };

    const setUnsetLink = () => {
        if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
            return;
        }
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink()
                .run();
            return;
        }

        // update link
        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();

        editor.chain().insertContent({ type: "emoji" });
    };

    const onEmojiClick = (event: EmojiClickData) => {
        editor.commands.insertContent(event.emoji);
    };

    const handleAlignText = (event: MouseEvent<HTMLElement>, newAlign: string | null) => {
        setAlignText(newAlign);
        switch (newAlign) {
            case "left":
                editor.commands.setTextAlign("left");
                break;
            case "center":
                editor.commands.setTextAlign("center");
                break;
            case "justify":
                editor.commands.setTextAlign("justify");
                break;
            default:
                break;
        }
    };

    editor.on("update", () => {
        setRedo(editor?.can().redo());
        setUndo(editor?.can().undo());
    });

    return (
        <div className={styles.wrapper}>
            <ToggleButtonGroup
                aria-label="text formatting"
                className={styles.groupWrapper}
            >
                <ToggleButton
                    onClick={() => editor.chain().toggleBold().run()}
                    value="bold"
                    aria-label="bold"
                    className={styles.toggleButton}
                >
                    <HandySvg src={boldIcon} />
                </ToggleButton>
                <ToggleButton
                    onClick={() => editor.chain().toggleItalic().run()}
                    value="italic"
                    aria-label="italic"
                    className={styles.toggleButton}
                >
                    <HandySvg src={italicIcon} />
                </ToggleButton>
                <ToggleButton
                    onClick={() => editor.chain().toggleUnderline().run()}
                    value="underlined"
                    aria-label="underlined"
                    className={styles.toggleButton}
                >
                    <HandySvg src={underlineIcon} />
                </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
                exclusive
                value={alignText}
                onChange={handleAlignText}
                aria-label="align text"
                className={styles.groupWrapper}
            >
                <ToggleButton
                    value="left"
                    aria-label="left"
                    className={styles.toggleButton}
                >
                    <HandySvg src={alignLeftIcon} />
                </ToggleButton>
                <ToggleButton
                    value="center"
                    aria-label="center"
                    className={styles.toggleButton}
                >
                    <HandySvg src={alignCenterIcon} />
                </ToggleButton>
                <ToggleButton
                    value="justify"
                    aria-label="justify"
                    className={styles.toggleButton}
                >
                    <HandySvg src={alignJustifyIcon} />
                </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
                aria-label="list item"
                className={styles.groupWrapper}
            >
                <ToggleButton
                    value="ordered"
                    onClick={() => editor.chain().toggleOrderedList().run()}
                    aria-label="ordered"
                    className={styles.toggleButton}
                >
                    <HandySvg src={orderedListIcon} />
                </ToggleButton>
                <ToggleButton
                    value="bullet"
                    onClick={() => editor.chain().toggleBulletList().run()}
                    aria-label="bullet"
                    className={styles.toggleButton}
                >
                    <HandySvg src={bulletListIcon} />
                </ToggleButton>
            </ToggleButtonGroup>
            <div className={styles.container}>
                <ToggleButton
                    value="link"
                    className={styles.toggleButton}
                    onClick={setUnsetLink}
                >
                    <HandySvg src={linkIcon} />
                </ToggleButton>
                <ToggleButton value="image" className={styles.toggleButton}>
                    <InputFile
                        id="upload image"
                        onChange={addImage}
                        wrapperClassName={styles.imageButton}
                        labelClassName={styles.imageButton}
                        labelChildren={<HandySvg src={imageIcon} />}
                    />
                </ToggleButton>
                <div className={styles.emojiButton}>
                    <ToggleButton
                        value="smile"
                        className={styles.toggleButton}
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                    >
                        <HandySvg src={smileIcon} />
                    </ToggleButton>
                    {showEmojiPicker && (
                        <div className={styles.emojiModal} ref={emojiRef}>
                            <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                lazyLoadEmojis
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.arrows}>
                <ToggleButton
                    value="back"
                    disabled={!undo}
                    className={cn(styles.toggleButton, styles.buttonBack, {
                        [styles.isActive]: undo,
                    })}
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <HandySvg src={ArrowLeftIcon} />
                </ToggleButton>
                <ToggleButton
                    value="forward"
                    disabled={!redo}
                    className={cn(styles.buttonForward, styles.toggleButton, {
                        [styles.isActive]: redo,
                    })}
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <HandySvg src={ArrowLeftIcon} />
                </ToggleButton>
            </div>
        </div>
    );
});
