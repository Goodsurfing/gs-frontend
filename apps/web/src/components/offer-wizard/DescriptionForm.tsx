"use client";

import { type FormEvent, useCallback, useRef, useState } from "react";

import { TextField } from "@/components/form/fields";
import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import { browserApi } from "@/lib/browserApi";
import {
    type DescriptionForm as Form, descriptionErrors, FULL_DESCRIPTION_MAX, SHORT_DESCRIPTION_MAX, toggleCategory,
} from "@/lib/offerWizard";

import { type CoverLabels, CoverUpload } from "./CoverUpload";
import { clearDraft, readDraft, writeDraft } from "./draft";
import { type GalleryLabels, GalleryUpload } from "./GalleryUpload";
import { toUploadedImage, type UploadedImage } from "./media";
import { apiErrorText, type VacancyElement, useVacancyElement } from "./useVacancy";
import { WizardActions } from "./WizardActions";
import { WizardTextarea } from "./WizardTextarea";

export interface DescriptionLabels {
    title: string;
    categories: string;
    short: string;
    shortHint: string;
    full: string;
    fullHint: string;
    titleRequired: string;
    required: string;
    coverRequired: string;
    cover: CoverLabels;
    gallery: GalleryLabels;
    gallerySaved: string;
    galleryError: string;
    saved: string;
    error: string;
    save: string;
    next: string;
    unsaved: string;
    loading: string;
    missing: string;
}

export interface CategoryOption { id: number; name: string; color: string }

export interface DescriptionDraft { form: Form; cover: UploadedImage | null }
type Draft = DescriptionDraft;

const isDraft = (value: unknown): value is Draft => {
    const v = value as Draft | null;
    return !!v && !!v.form && typeof v.form.title === "string" && Array.isArray(v.form.categoryIds);
};

const ErrorText = ({ text }: { text: string }) => <p role="alert" className="my-[15px] text-[0.75rem] text-[#d32f2f]">{text}</p>;

/** Описание из вакансии: у новой вакансии блока нет */
const fromVacancy = (vacancy: VacancyElement): Draft => {
    const description = vacancy.description as VacancyElement["description"] | null;
    return {
        form: {
            title: description?.title ?? "",
            categoryIds: (description?.categories ?? []).map((category) => category.id).filter((id) => Number.isInteger(id)),
            shortDescription: description?.shortDescription ?? "",
            fullDescription: description?.description ?? "",
        },
        cover: toUploadedImage(description?.image),
    };
};

/**
 * Шаг «Описание» (OfferDescription старого фронта): название, категории (до
 * пяти), краткое и полное описание, обложка — всё обязательно; фото вакансии
 * сохраняются сразу при загрузке и удалении. «Сохранить» — PATCH
 * /api/v1/vacancy/description/{id}, как в старом фронте.
 */
export function DescriptionForm({ id, nextHref, categories, labels }: { id: string; nextHref: string; categories: CategoryOption[]; labels: DescriptionLabels }) {
    const state = useVacancyElement(id);
    if (state.status === "missing") return <p className="mt-10 text-[18px] text-ink-tertiary">{labels.missing}</p>;
    if (state.status === "loading") return <Loading label={labels.loading} className="min-h-[200px]" />;
    return <VacancyDescription id={id} nextHref={nextHref} categories={categories} labels={labels} vacancy={state.vacancy} />;
}

function VacancyDescription({ id, nextHref, categories, labels, vacancy }: {
    id: string;
    nextHref: string;
    categories: CategoryOption[];
    labels: DescriptionLabels;
    vacancy: VacancyElement;
}) {
    const session = useSession();
    return (
        <DescriptionEditor
            id={id}
            nextHref={nextHref}
            categories={categories}
            labels={labels}
            saved={fromVacancy(vacancy)}
            savedGallery={vacancy.galleryImages ?? []}
            // Фото вакансии сохраняются сразу при загрузке и удалении, как в старом фронте
            saveGallery={async (images) => {
                const result = await browserApi(session.token)
                    .PATCH("/api/v1/vacancy/image-gallery/{id}", { params: { path: { id: Number(id) } }, body: { galleryImageIds: images.map((image) => image.id) } })
                    .catch(() => null);
                return !!result?.response.ok;
            }}
            onSave={async ({ form, cover }) => {
                const result = await browserApi(session.token)
                    .PATCH("/api/v1/vacancy/description/{id}", {
                        params: { path: { id: Number(id) } },
                        body: { title: form.title, description: form.fullDescription, shortDescription: form.shortDescription, categoryIds: form.categoryIds, imageId: cover.id },
                    })
                    .catch(() => null);
                // В OpenAPI у этой операции описан только ответ 200 — ошибку берём из ответа как есть; пустой ответ с ошибкой
                // openapi-fetch отдаёт как { error: undefined }, поэтому смотрим на статус
                if (!result?.response.ok) return apiErrorText(result ? (result as { error?: unknown }).error : null, labels.error);
                return null;
            }}
        />
    );
}

/**
 * Форма описания: название, категории (до пяти), краткое и полное описание,
 * обложка, фото. Общая для вакансии и сбора (OfferDescriptionForm и
 * InviteDescriptionForm старого фронта). saveGallery задан — фото сохраняются
 * сразу; не задан — уходят в onSave вместе с описанием. onSave вернёт текст
 * ошибки или null.
 */
export function DescriptionEditor({ id, nextHref, categories, labels, saved, savedGallery, saveGallery: persistGallery, onSave, draftStep = "description" }: {
    id: string;
    nextHref: string;
    categories: CategoryOption[];
    labels: DescriptionLabels;
    saved: Draft;
    savedGallery: Parameters<typeof toUploadedImage>[0][];
    saveGallery?: (images: UploadedImage[]) => Promise<boolean>;
    onSave: (value: { form: Form; cover: UploadedImage; gallery: UploadedImage[] }) => Promise<string | null>;
    draftStep?: string;
}) {
    const session = useSession();
    const [initial] = useState(() => readDraft(draftStep, id, isDraft));
    const [draft, setDraft] = useState<Draft>(() => initial ?? saved);
    const [gallery, setGallery] = useState<UploadedImage[]>(() => savedGallery.map(toUploadedImage).filter((image): image is UploadedImage => image !== null));
    const [unsaved, setUnsaved] = useState(!!initial);
    const [submitted, setSubmitted] = useState(false);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    const update = useCallback((next: Draft) => {
        setDraft(next);
        setUnsaved(true);
        writeDraft(draftStep, id, next);
    }, [draftStep, id]);

    const { form, cover } = draft;
    const set = (patch: Partial<Form>) => update({ form: { ...form, ...patch }, cover });
    const errors = descriptionErrors(form, !!cover);
    const show = (field: keyof typeof errors) => submitted && errors[field];

    // Галерея меняется из нескольких мест сразу (загрузки, удаление): изменения применяются к последнему
    // сохранённому списку по очереди, иначе параллельные PATCH затирали бы друг друга
    const galleryRef = useRef(gallery);
    const queue = useRef<Promise<void>>(Promise.resolve());
    const saveGallery = (change: (current: UploadedImage[]) => UploadedImage[]) => {
        const run = queue.current.then(async () => {
            const images = change(galleryRef.current);
            if (!persistGallery) {
                // Сохранится вместе с описанием
                galleryRef.current = images;
                setGallery(images);
                setUnsaved(true);
                return;
            }
            setToast(null);
            if (!await persistGallery(images)) {
                setToast({ text: labels.galleryError, ok: false });
                return;
            }
            galleryRef.current = images;
            setGallery(images);
            setToast({ text: labels.gallerySaved, ok: true });
        });
        queue.current = run;
        return run;
    };

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitted(true);
        if (Object.keys(errors).length || !cover) return;
        setBusy(true);
        setToast(null);
        const error = await onSave({ form, cover, gallery: galleryRef.current });
        setBusy(false);
        if (error) {
            setToast({ text: error, ok: false });
            return;
        }
        clearDraft(draftStep, id);
        setUnsaved(false);
        setToast({ text: labels.saved, ok: true });
    };

    return (
        <form onSubmit={submit} noValidate>
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
            <div className="flex flex-col gap-[30px]">
                <div>
                    <TextField label={labels.title} value={form.title} aria-invalid={!!show("title")} onChange={(event) => set({ title: event.target.value })} />
                    {show("title") && <ErrorText text={labels.titleRequired} />}
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-[Lato] text-[0.875rem] text-caption">{labels.categories}</p>
                    <div className="flex max-w-[39.25rem]">
                        <div role="group" aria-label={labels.categories} className="flex max-w-[624px] flex-wrap gap-2.5 rounded-[4px]">
                            {categories.map((category) => {
                                const pressed = form.categoryIds.includes(category.id);
                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        aria-pressed={pressed}
                                        onClick={() => set({ categoryIds: toggleCategory(form.categoryIds, category.id) })}
                                        style={{ borderColor: category.color, backgroundColor: pressed ? category.color : undefined }}
                                        className={`box-content flex max-h-[35px] cursor-pointer items-center justify-center rounded-[26px] border-2 border-solid px-2.5 py-[5px] font-[Lato] text-[14px] leading-[1.75] font-medium tracking-[0.02857em] text-ink-secondary [&:not(:first-child)]:-ml-px ${pressed ? "" : "bg-transparent hover:bg-[rgba(0,0,0,0.04)]"}`}
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {show("categoryIds") && <ErrorText text={labels.required} />}
                </div>
                <div>
                    <WizardTextarea label={labels.short} hint={labels.shortHint} maxLength={SHORT_DESCRIPTION_MAX} invalid={!!show("shortDescription")} value={form.shortDescription} onChange={(event) => set({ shortDescription: event.target.value })} />
                    {show("shortDescription") && <ErrorText text={labels.required} />}
                </div>
                <div>
                    <WizardTextarea label={labels.full} hint={labels.fullHint} maxLength={FULL_DESCRIPTION_MAX} invalid={!!show("fullDescription")} textareaClass="h-[11.375rem]" value={form.fullDescription} onChange={(event) => set({ fullDescription: event.target.value })} />
                    {show("fullDescription") && <ErrorText text={labels.required} />}
                </div>
                <div>
                    <CoverUpload value={cover} token={session.token} labels={labels.cover} onChange={(next) => update({ form, cover: next })} />
                    {show("cover") && <ErrorText text={labels.coverRequired} />}
                </div>
                <GalleryUpload
                    images={gallery}
                    token={session.token}
                    labels={labels.gallery}
                    onChange={saveGallery}
                    onError={(text) => {
                        if (text) setToast({ text, ok: false });
                    }}
                />
            </div>
            <WizardActions unsaved={unsaved} busy={busy} nextHref={nextHref} labels={labels} className="pt-[60px]" />
        </form>
    );
}
