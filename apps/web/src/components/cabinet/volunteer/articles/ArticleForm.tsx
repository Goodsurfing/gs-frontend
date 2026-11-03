"use client";

import type { components } from "@goodsurfing/api";
import { useEffect, useId, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Spinner } from "@/components/ui/Spinner";
import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { type MediaObject, uploadMedia } from "@/lib/uploadMedia";

import { ArticleEditor, type ArticleEditorLabels } from "./ArticleEditor";

type Category = components["schemas"]["ListAllResult"];

export interface ArticleFields {
    image: MediaObject | null;
    name: string;
    categoryIds: number[];
    description: string;
}

export interface ArticleFormLabels {
    addCover: string;
    coverHint: string;
    change: string;
    remove: string;
    title: string;
    titlePlaceholder: string;
    category: string;
    publish: string;
    draft: string;
    errors: { cover: string; required: string; short: string; long: string; categories: string };
    /** Список категорий не загрузился */
    categoriesError: string;
    /** Ссылка с запрещённой схемой в редакторе */
    badLink: string;
    editor: ArticleEditorLabels;
}

/** Не больше пяти категорий, как в старом фронте */
const MAX_CATEGORIES = 5;
const DEFAULT_COLOR = "var(--color-primary)";

export const EMPTY_ARTICLE: ArticleFields = { image: null, name: "", categoryIds: [], description: "" };

/**
 * Форма статьи (ArticleForm старого фронта): обложка, название (5–150
 * знаков), категории (1–5), текст в редакторе; «Опубликовать» и «Сохранить в
 * черновики». Ошибки показываются после первой попытки отправки и дальше — по
 * мере ввода (mode: "onChange" react-hook-form).
 */
export function ArticleForm({ locale, initial, busy, labels, onSubmit, onUploadError, onMessage }: {
    locale: Locale;
    initial: ArticleFields;
    busy: boolean;
    labels: ArticleFormLabels;
    onSubmit: (fields: ArticleFields, isActive: boolean) => void;
    onUploadError: () => void;
    /** Сообщение об ошибке пользователю (всплывающее) */
    onMessage: (text: string) => void;
}) {
    const session = useSession();
    const nameId = useId();
    const [fields, setFields] = useState(initial);
    const [tried, setTried] = useState(false);
    const [uploading, setUploading] = useState(false);
    // false — список не загрузился
    const [categories, setCategories] = useState<Category[] | false | null>(null);
    const set = (patch: Partial<ArticleFields>) => setFields((prev) => ({ ...prev, ...patch }));

    useEffect(() => {
        let cancelled = false;
        void browserApi().GET("/api/v1/blog-category", { params: { query: { lang: locale } } })
            .then(({ data, response }) => !cancelled && setCategories(response.ok && data ? data : false))
            .catch(() => !cancelled && setCategories(false));
        return () => {
            cancelled = true;
        };
    }, [locale]);

    const name = fields.name.trim();
    const errors = {
        image: fields.image ? null : labels.errors.cover,
        name: !fields.name ? labels.errors.required : name.length < 5 ? labels.errors.short : fields.name.length > 150 ? labels.errors.long : null,
        categories: fields.categoryIds.length > 0 ? null : labels.errors.categories,
    };
    const valid = !errors.image && !errors.name && !errors.categories;
    const submit = (isActive: boolean) => {
        setTried(true);
        if (valid) onSubmit(fields, isActive);
    };

    const upload = async (file: File | undefined) => {
        if (!file) return;
        setUploading(true);
        try {
            set({ image: await uploadMedia(file, session.token) });
        } catch {
            // Неудачная замена не трогает текущую обложку
            onUploadError();
        } finally {
            setUploading(false);
        }
    };
    const toggle = (id: number) => {
        const selected = fields.categoryIds.includes(id);
        if (selected) set({ categoryIds: fields.categoryIds.filter((item) => item !== id) });
        else if (fields.categoryIds.length < MAX_CATEGORIES) set({ categoryIds: [...fields.categoryIds, id] });
    };

    const error = (text: string | null) => (tried && text ? <span role="alert" className="mx-3.5 text-[0.75rem] text-error-field">{text}</span> : null);
    // Поле файла скрыто визуально (sr-only), но доступно с клавиатуры — обводка у подписи
    const focusRing = "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary";
    const coverButton = "relative box-border flex h-[27px] max-w-[95px] cursor-pointer items-center rounded-[6px] border border-primary bg-white px-5 py-1.5 text-[12px] text-primary";
    const button = "w-full cursor-pointer rounded-[10px] border border-primary px-[50px] py-2.5 text-center text-label transition-all duration-300 disabled:cursor-default disabled:opacity-70";

    return (
        <form className="mt-10 flex flex-col gap-[15px]" onSubmit={(event) => event.preventDefault()}>
            <div>
                <div className="flex flex-col gap-2.5">
                    {fields.image ? (
                        <div className="relative max-w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element -- обложка из хранилища */}
                            <img loading="eager" src={mediaUrl(fields.image, "large")} alt="" className="max-h-[270px] w-full overflow-hidden object-cover" />
                            {uploading ? <Spinner className="absolute top-1/2 left-1/2 !w-auto -translate-x-1/2 -translate-y-1/2" /> : (
                                <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5">
                                    <label className={`${coverButton} ${focusRing}`}>
                                        {labels.change}
                                        <input type="file" accept="image/*" className="sr-only" onChange={(event) => { void upload(event.target.files?.[0]); event.target.value = ""; }} />
                                    </label>
                                    <button type="button" className={coverButton} onClick={() => set({ image: null })}>{labels.remove}</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <label className={`relative mb-2.5 box-content block h-[270px] w-full cursor-pointer rounded-[2px] border border-dashed border-caption bg-field ${focusRing}`}>
                            {uploading ? <Spinner className="absolute top-1/2 left-1/2 !w-auto -translate-x-1/2 -translate-y-1/2" /> : (
                                <span className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                    <img src="/web/icons/editor/photo-camera.svg" alt="" />
                                    <span className="mt-3.5 text-[14px] whitespace-nowrap text-caption">{labels.addCover}</span>
                                </span>
                            )}
                            <input type="file" accept="image/*" aria-label={labels.addCover} className="sr-only" disabled={uploading} onChange={(event) => { void upload(event.target.files?.[0]); event.target.value = ""; }} />
                        </label>
                    )}
                    {error(errors.image)}
                </div>
                <span className="text-[10px] text-caption">{labels.coverHint}</span>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor={nameId} className="text-[14px] text-caption">{labels.title}</label>
                <input
                    id={nameId}
                    value={fields.name}
                    placeholder={labels.titlePlaceholder}
                    aria-invalid={tried && !!errors.name}
                    onChange={(event) => set({ name: event.target.value })}
                    className="box-border h-11 w-full rounded-[10px] border border-black/23 bg-transparent px-3.5 text-[16px] outline-none placeholder:text-black/42 hover:border-primary focus:border-2 focus:border-primary focus:px-[13px] aria-[invalid=true]:border-error-field"
                />
                {tried && errors.name && <span role="alert" className="mx-3.5 mt-[3px] text-[0.75rem] leading-[1.66] text-error-field">{errors.name}</span>}
            </div>
            <div className="flex flex-col gap-2">
                <span id={`${nameId}-categories`} className="text-[14px] text-caption">{labels.category}</span>
                <div className="flex flex-col gap-2.5">
                    {categories === null ? <Spinner /> : categories === false ? (
                        <p role="alert" className="text-[14px] text-error-field">{labels.categoriesError}</p>
                    ) : (
                        <div role="group" aria-labelledby={`${nameId}-categories`} className="flex max-w-[39.25rem] flex-wrap gap-2.5">
                            {categories.map((category) => {
                                const color = category.color || DEFAULT_COLOR;
                                const selected = fields.categoryIds.includes(category.id);
                                return (
                                    <button
                                        key={category.id}
                                        // Как ToggleButtonGroup MUI: у всех, кроме первой, отступ слева −1 px
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() => toggle(category.id)}
                                        style={{ borderColor: color, backgroundColor: selected ? color : undefined }}
                                        className="box-content max-h-[35px] cursor-pointer rounded-[26px] not-first:-ml-px border-2 px-2.5 py-[5px] text-[14px] leading-[1.75] font-medium tracking-[0.02857em] text-ink-secondary"
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    {error(errors.categories)}
                </div>
            </div>
            <ArticleEditor value={fields.description} onChange={(description) => set({ description })} onUploadError={onUploadError} onBadLink={() => onMessage(labels.badLink)} token={session.token} labels={labels.editor} />
            <div className="mt-20 flex gap-[30px] down-lg:mt-10 down-lg:flex-wrap">
                <button type="button" disabled={busy} onClick={() => submit(true)} className={`${button} bg-primary text-white hover:bg-white hover:text-primary`}>{labels.publish}</button>
                <button type="button" disabled={busy} onClick={() => submit(false)} className={`${button} text-primary hover:bg-primary hover:text-white`}>{labels.draft}</button>
            </div>
        </form>
    );
}
