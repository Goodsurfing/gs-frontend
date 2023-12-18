import { HandySvg } from "@handy-ones/handy-svg";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { type Editor } from "@tiptap/react";
import cn from "classnames";
import EmojiPicker from "emoji-picker-react";
import React, {
    FC,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

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
import bulletListIcon from "@/shared/assets/icons/textEditor/bulletList.svg";
import imageIcon from "@/shared/assets/icons/textEditor/image.svg";
import alignJustifyIcon from "@/shared/assets/icons/textEditor/justifyAlign.svg";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import InputFile from "../InputFile/InputFile";
import styles from "./ToolBar.module.scss";

interface ToolBarProps {
    editor: Editor | null;
    undoRedo: Object;
}

export const ToolBar: FC<ToolBarProps> = memo((props: ToolBarProps) => {
    const { editor, undoRedo } = props;
    const [format, setFormat] = useState(null);
    const [alignText, setAlignText] = useState(null);
    const [listItem, setListItem] = useState(null);
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
            // console.log(file);
            const url = URL.createObjectURL(file);
            editor?.chain().focus().setImage({ src: url }).run();
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

    const onEmojiClick = (event) => {
        editor.commands.insertContent(event.emoji);
    };

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

    const handleAlignText = (event, newAlign) => {
        setAlignText(newAlign);
        switch (newAlign) {
            case "left":
                editor.chain().focus().setTextAlign("left").run();
                break;
            case "center":
                editor.chain().focus().setTextAlign("center").run();
                break;
            case "justify":
                editor.chain().focus().setTextAlign("justify").run();
                break;
            default:
                break;
        }
    };

    const handleListItem = (event, newList) => {
        setListItem(newList);
        switch (newList) {
            case "bullet":
                editor.chain().toggleBulletList().run();
                break;
            case "ordered":
                editor.chain().toggleOrderedList().run();
                break;
            default:
                break;
        }
    };

    const handleBack = () => {
        // if (editor?.can().undo()) {
        editor.chain().focus().undo().run();
        // }
    };

    const handleForward = () => {
        // if (editor?.can().redo()) {
        editor.chain().focus().redo().run();
        // }
    };

    return (
        <div className={styles.wrapper}>
            {editor?.can().redo() && <span>redo</span>}
            {editor?.can().undo() && <span>undo</span>}
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
                exclusive
                value={listItem}
                onChange={handleListItem}
                aria-label="list item"
                className={styles.groupWrapper}
            >
                <ToggleButton
                    value="ordered"
                    aria-label="ordered"
                    className={styles.toggleButton}
                >
                    <HandySvg src={markIcon} />
                </ToggleButton>
                <ToggleButton
                    value="bullet"
                    aria-label="bullet"
                    className={styles.toggleButton}
                >
                    <HandySvg src={bulletListIcon} />
                </ToggleButton>
            </ToggleButtonGroup>
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
            <div>
                <ToggleButton
                    value="back"
                    className={cn(styles.toggleButton, styles.buttonBack, {
                        [styles.isActive]: !editor.can().undo(),
                    })}
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <HandySvg src={ArrowLeftIcon} />
                </ToggleButton>
                <button
                    className="menu-button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    Есть я

                </button>
                <ToggleButton
                    value="forward"
                    className={cn(styles.buttonForward, styles.toggleButton, {
                        [styles.isActive]: !editor.can().redo(),
                    })}
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <HandySvg src={ArrowLeftIcon} />
                </ToggleButton>
            </div>
        </div>
    );
});
