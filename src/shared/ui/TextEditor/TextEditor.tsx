import BulletList from "@tiptap/extension-bullet-list";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import History from "@tiptap/extension-history";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import cn from "classnames";
import React, { useEffect, useState } from "react";

import { ToolBar } from "@/shared/ui/ToolBar/ToolBar";

import styles from "./TextEditor.module.scss";

interface TiptapEditorProps {
    onChange: (content: string) => void;
    value: string;
}

export const TextEditor: React.FC<TiptapEditorProps> = ({
    onChange,
    value,
}) => {
    const [undoRedo, setUndoRedo] = useState({
        undo: false,
        redo: false,
    });
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            Underline.configure(),
            OrderedList,
            BulletList,
            ListItem,
            TextAlign,
            Link,
            Image,
        ],
        content: value,
        editorProps: {
            attributes: {
                class: cn(styles.input),
            },
        },
        onUpdate: () => onChange(editor?.getHTML() || ""),
    });

    const updateUndoRedo = () => {
        console.log(editor?.can().undo());
        setUndoRedo({
            undo: editor?.can().undo(),
            redo: editor?.can().redo(),
        });
    };

    return (
        <div className={styles.wrapper}>
            <ToolBar editor={editor} undoRedo={undoRedo} />
            <EditorContent editor={editor} on />
        </div>
    );
};
