"use client";

import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { Spinner } from "@/components/ui/Spinner";
import { mediaUrl } from "@/lib/media";
import { uploadMedia } from "@/lib/uploadMedia";

// Окно смайлов тяжёлое — грузится только по кнопке
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export interface ArticleEditorLabels {
    bold: string;
    italic: string;
    underline: string;
    alignLeft: string;
    alignCenter: string;
    alignJustify: string;
    ordered: string;
    bullet: string;
    link: string;
    image: string;
    emoji: string;
    undo: string;
    redo: string;
    clear: string;
    text: string;
}

const icon = (name: string) => `/web/icons/editor/${name}.svg`;

/**
 * Картинка с изменением размера за углы. Встроенный resize tiptap 3 пишет и
 * ширину, и высоту, а ResizableImageExtension старого фронта — только ширину:
 * на /blog/:slug высота из атрибута уходит в style и растягивает картинку на
 * узком экране. Высота живёт только в редакторе (пропорции при перетаскивании),
 * в HTML статьи не попадает и из него не читается.
 */
const ArticleImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            height: { default: null, parseHTML: () => null, renderHTML: () => ({}) },
        };
    },
});

/**
 * Редактор текста статьи (TextEditor + ToolBar старого фронта, tiptap 3):
 * жирный, курсив, подчёркивание, выравнивание, списки, ссылка, картинка,
 * смайлы, отмена и повтор; справа — крестик «очистить». HTML на выходе — как у
 * старого редактора (без выравнивания по умолчанию и пустого абзаца в конце).
 */
export function ArticleEditor({ value, onChange, onUploadError, onBadLink, token, labels }: {
    value: string;
    onChange: (html: string) => void;
    onUploadError: () => void;
    /** Ссылка с запрещённой схемой (javascript: и т. п.) — tiptap её молча не ставит */
    onBadLink: () => void;
    token?: string;
    labels: ArticleEditorLabels;
}) {
    const editor = useEditor({
        immediatelyRender: false,
        // Иначе кнопки панели не видят, что жирный или список включены
        shouldRerenderOnTransaction: true,
        extensions: [
            StarterKit.configure({ trailingNode: false }),
            TextAlign.configure({ types: ["heading", "paragraph"], alignments: ["left", "center", "justify"] }),
            // Картинку тянут за углы (ResizableImageExtension старого фронта, не уже 60 px)
            ArticleImage.configure({ inline: true, resize: { enabled: true, directions: ["top-left", "top-right", "bottom-left", "bottom-right"], minWidth: 60, alwaysPreserveAspectRatio: true } }),
        ],
        content: value,
        editorProps: {
            attributes: {
                role: "textbox",
                "aria-multiline": "true",
                "aria-label": labels.text,
                class: "min-h-[500px] w-full border border-t-0 border-caption p-[15px] outline-none [&_a]:cursor-pointer [&_img]:max-w-full [&_ol]:list-decimal [&_ol]:pl-10 [&_p]:text-[16px] [&_p]:font-medium [&_p]:text-ink-secondary [&_ul]:list-disc [&_ul]:pl-10",
            },
        },
        onUpdate: ({ editor: current }) => onChange(current.getHTML()),
    });

    // Данные пришли позже (редактирование статьи) — подставить в редактор
    useEffect(() => {
        // Пустое значение у пустого редактора — не правка: иначе «отменить» активна сразу
        if (!editor || value === editor.getHTML() || (!value && editor.isEmpty)) return;
        editor.commands.setContent(value || "");
    }, [value, editor]);

    return (
        <div className="flex w-full gap-2.5">
            <div className="w-[90%]">
                {editor && <ToolBar editor={editor} token={token} onUploadError={onUploadError} onBadLink={onBadLink} labels={labels} />}
                <EditorContent editor={editor} />
            </div>
            <button type="button" aria-label={labels.clear} onClick={() => editor?.commands.setContent("")} className="h-6 w-6 shrink-0 cursor-pointer">
                <svg aria-hidden width="24" height="24" viewBox="0 0 14 14" className="block">
                    <path fillRule="evenodd" clipRule="evenodd" d="M14 1.41 12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7 14 1.41Z" />
                </svg>
            </button>
        </div>
    );
}

/** Кнопка панели (ToggleButton MUI 24×24 без отступов): выбранная — серый фон */
function Tool({ label, src, active = false, disabled = false, flip = false, onClick }: {
    label: string;
    src: string;
    active?: boolean;
    disabled?: boolean;
    flip?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            aria-pressed={active}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onClick}
            className={`flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-[4px] transition-colors hover:bg-black/4 disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent ${active ? "bg-black/8" : ""}`}
        >
            {/* Иконка на 4 px выше центра кнопки — как svg из ReactSVG в старом ToolBar */}
            {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
            <img loading="lazy" decoding="async" src={src} alt="" className={`h-6 w-6 -translate-y-1 ${flip ? "-scale-x-100" : ""}`} />
        </button>
    );
}

function ToolBar({ editor, token, onUploadError, onBadLink, labels }: {
    editor: Editor;
    token?: string;
    onUploadError: () => void;
    onBadLink: () => void;
    labels: ArticleEditorLabels;
}) {
    const [uploading, setUploading] = useState(false);
    const [emoji, setEmoji] = useState(false);
    const emojiRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!emoji) return;
        const close = (event: MouseEvent) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) setEmoji(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [emoji]);

    const align = editor.isActive({ textAlign: "center" }) ? "center" : editor.isActive({ textAlign: "justify" }) ? "justify" : "left";
    const list = (type: "bulletList" | "orderedList") => {
        if (editor.isActive(type)) editor.chain().focus().liftListItem("listItem").run();
        else if (type === "bulletList") editor.chain().focus().toggleBulletList().run();
        else editor.chain().focus().toggleOrderedList().run();
    };
    const link = () => {
        if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
            return;
        }
        const url = window.prompt("URL", editor.getAttributes("link").href as string | undefined);
        if (url === null) return;
        if (url === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
        else if (!editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()) onBadLink();
    };
    const image = async (file: File | undefined) => {
        if (!file) return;
        setUploading(true);
        try {
            const media = await uploadMedia(file, token);
            // В текст статьи — оригинал, как в старом фронте
            const src = mediaUrl(media);
            if (src) editor.chain().focus().setImage({ src }).run();
            else onUploadError();
        } catch {
            onUploadError();
        } finally {
            setUploading(false);
        }
    };

    // Первые три группы — ToggleButtonGroup MUI: соседние кнопки сдвинуты на −1 px
    return (
        <div role="toolbar" className="flex flex-wrap gap-6 border border-caption border-b-caption/53 p-2">
            <div className="flex gap-3.5 [&>*:not(:first-child)]:-ml-px">
                <Tool label={labels.bold} src={icon("bold")} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
                <Tool label={labels.italic} src={icon("italic")} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
                <Tool label={labels.underline} src={icon("underline")} active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
            </div>
            <div className="flex gap-3.5 [&>*:not(:first-child)]:-ml-px">
                <Tool label={labels.alignLeft} src={icon("alignLeft")} active={align === "left"} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
                <Tool label={labels.alignCenter} src={icon("alignCenter")} active={align === "center"} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
                <Tool label={labels.alignJustify} src={icon("alignJustify")} active={align === "justify"} onClick={() => editor.chain().focus().setTextAlign("justify").run()} />
            </div>
            <div className="flex gap-3.5 [&>*:not(:first-child)]:-ml-px">
                <Tool label={labels.ordered} src={icon("orderedList")} active={editor.isActive("orderedList")} onClick={() => list("orderedList")} />
                <Tool label={labels.bullet} src={icon("bulletList")} active={editor.isActive("bulletList")} onClick={() => list("bulletList")} />
            </div>
            <div className="flex gap-3.5">
                <Tool label={labels.link} src={icon("link")} active={editor.isActive("link")} onClick={link} />
                {uploading ? <Spinner className="h-6 !w-6 [&_svg]:h-6 [&_svg]:w-6" /> : (
                    <label className="relative flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-[4px] transition-colors hover:bg-black/4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary">
                        {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                        <img src={icon("image")} alt="" className="h-6 w-6 -translate-y-1" />
                        {/* sr-only, а не hidden: поле доступно с клавиатуры (Tab, Enter/пробел) */}
                        <input type="file" accept="image/*" aria-label={labels.image} className="sr-only" onChange={(event) => { void image(event.target.files?.[0]); event.target.value = ""; }} />
                    </label>
                )}
                <div ref={emojiRef} className="relative">
                    <Tool label={labels.emoji} src={icon("smile")} active={emoji} onClick={() => setEmoji(!emoji)} />
                    {emoji && (
                        <div className="absolute z-[4]">
                            <EmojiPicker lazyLoadEmojis onEmojiClick={(data) => editor.commands.insertContent(data.emoji)} />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-5">
                <Tool label={labels.undo} src={icon("arrowLeft")} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} />
                <Tool label={labels.redo} src={icon("arrowLeft")} flip disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} />
            </div>
        </div>
    );
}
