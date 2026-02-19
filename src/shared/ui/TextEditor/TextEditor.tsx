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
import React, { useEffect } from "react";
import { HandySvg } from "@handy-ones/handy-svg";
import deleteIcon from "@/shared/assets/icons/delete.svg";

import { ToolBar } from "@/shared/ui/ToolBar/ToolBar";

import ResizableImageExtension from "./model/extensions/resizableImage";
import styles from "./TextEditor.module.scss";

interface TiptapEditorProps {
    onChange: (content: string) => void;
    value: string;
    onErrorUploadImage: (error: string) => void;
}

export const TextEditor: React.FC<TiptapEditorProps> = ({
    onChange,
    value,
    onErrorUploadImage,
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
        onUpdate: () => {
            onChange(editor?.getHTML() || "");
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "");
        }
    }, [value, editor]);

    const clearContent = () => {
        editor?.commands.setContent("");
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <ToolBar editor={editor} onErrorUploadImage={onErrorUploadImage} />
                <EditorContent editor={editor} />
            </div>
            <div onClick={clearContent}>
                <HandySvg src={deleteIcon} />
            </div>
        </div>
    );
};
