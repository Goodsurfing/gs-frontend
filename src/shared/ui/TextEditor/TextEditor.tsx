import BulletList from "@tiptap/extension-bullet-list";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import cn from "classnames";
import React from "react";
import { HandySvg } from "@handy-ones/handy-svg";
import deleteIcon from "@/shared/assets/icons/delete.svg";

import { ToolBar } from "@/shared/ui/ToolBar/ToolBar";

import styles from "./TextEditor.module.scss";
import ResizableImageExtension from "./model/extensions/resizableImage";

interface TiptapEditorProps {
    onChange: (content: string) => void;
    value: string;
}

export const TextEditor: React.FC<TiptapEditorProps> = ({
    onChange,
    value,
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            Underline.configure(),
            OrderedList,
            BulletList,
            ListItem,
            TextAlign.configure({
                types: ["heading", "paragraph"],
                alignments: ["left", "center", "justify"],
                defaultAlignment: "left",
            }),
            Link,
            Image,
            ResizableImageExtension,
        ],
        content: value,
        editorProps: {
            attributes: {
                class: cn(styles.input),
            },
        },
        onUpdate: () => onChange(editor?.getHTML() || ""),
    });

    const clearContent = () => {
        editor?.commands.setContent("");
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <ToolBar editor={editor} />
                <EditorContent editor={editor} />
            </div>
            <div onClick={clearContent}>
                <HandySvg src={deleteIcon} />
            </div>
        </div>
    );
};
