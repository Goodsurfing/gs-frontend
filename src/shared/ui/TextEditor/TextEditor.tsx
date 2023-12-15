import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import cn from "classnames";
import Underline from "@tiptap/extension-underline";
import styles from "./TextEditor.module.scss";
import { ToolBar } from "@/shared/ui/ToolBar/ToolBar";

interface TiptapEditorProps {
    onChange: (content: string) => void;
    value: string;
}

export const TextEditor: React.FC<TiptapEditorProps> = ({ onChange, value }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            Underline.configure(),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: cn(styles.input),
            },
        },
        onUpdate: () => onChange(editor?.getHTML() || ""),
    });

    return (
        <div className={styles.wrapper}>
            <ToolBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};
