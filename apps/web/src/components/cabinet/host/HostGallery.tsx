"use client";

import { useCallback, useState } from "react";

import { type PendingPhoto, PhotoUploader } from "@/components/cabinet/PhotoUploader";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import { mediaUrl } from "@/lib/media";
import { MAX_UPLOAD_SIZE, uploadMedia } from "@/lib/uploadMedia";

import { mediaIri, useMyOrganization } from "./useMyOrganization";

/** Фото в галерее организации — не больше 10 (ImagesUploader старого фронта) */
export const GALLERY_LIMIT = 10;

export interface HostGalleryLabels {
    add: string;
    drop: string;
    remove: string;
    tooMany: string;
    tooBig: string;
    saved: string;
    error: string;
    loadError: string;
    gallery: { close: string; prev: string; next: string; photo: string };
}

/**
 * Фотогалерея организации (features/Gallery/HostGallery старого фронта):
 * файлы загружаются в media_objects, затем весь список IRI записывается в
 * организацию; удаление — тем же PATCH без фото.
 */
export function HostGallery({ labels }: { labels: HostGalleryLabels }) {
    const { organization, failed, save, token } = useMyOrganization();
    const [pending, setPending] = useState<PendingPhoto[]>([]);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const [open, setOpen] = useState<number | null>(null);
    const closeToast = useCallback(() => setToast(null), []);

    if (failed) return <p className="mt-[45px]">{labels.loadError}</p>;
    if (!organization) return <Loading className="mt-[45px] min-h-[130px] max-w-[740px]" />;

    const images = organization.galleryImages ?? [];
    const iris = images.flatMap((image) => (image.id ? [mediaIri(image.id)] : []));

    const add = async (files: File[]) => {
        const free = GALLERY_LIMIT - images.length;
        if (free <= 0) {
            setToast({ text: labels.tooMany, ok: false });
            return;
        }
        const batch = files.slice(0, free).map((file) => ({ file, key: `${Date.now()}-${Math.random()}`, preview: URL.createObjectURL(file) }));
        setPending((prev) => [
            ...prev,
            ...batch.map(({ key, preview, file }) => ({ key, preview, error: file.size > MAX_UPLOAD_SIZE ? labels.tooBig : undefined })),
        ]);
        const results = await Promise.all(batch.filter(({ file }) => file.size <= MAX_UPLOAD_SIZE).map(async ({ file, key }) => {
            try {
                return { key, iri: (await uploadMedia(file, token))["@id"] };
            } catch {
                return { key, iri: null };
            }
        }));
        const done = results.filter((result): result is { key: string; iri: string } => !!result.iri);
        // Загруженные плитки уходят, неудачные остаются красными
        setPending((prev) => prev
            .filter((item) => !done.some((result) => result.key === item.key))
            .map((item) => (results.some((result) => result.key === item.key) ? { ...item, failed: true } : item)));
        if (done.length < results.length) setToast({ text: labels.error, ok: false });
        if (!done.length) return;
        const ok = await save({ galleryImages: [...iris, ...done.map((result) => result.iri)] });
        setToast({ text: ok ? labels.saved : labels.error, ok });
    };

    const remove = async (iri: string) => {
        const ok = await save({ galleryImages: iris.filter((item) => item !== iri) });
        setToast({ text: ok ? labels.saved : labels.error, ok });
    };

    return (
        <div className="mt-[45px] max-w-[740px]">
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={closeToast} />
            <PhotoUploader
                photos={images.flatMap((image) => (image.id ? [{ key: mediaIri(image.id), src: mediaUrl(image, "medium") ?? "" }] : []))}
                pending={pending}
                onFiles={(files) => void add(files)}
                onRemove={(key) => void remove(key)}
                onCancel={(key) => setPending((prev) => prev.filter((item) => item.key !== key))}
                onOpen={setOpen}
                labels={{ add: labels.add, drop: labels.drop, remove: labels.remove, photo: labels.gallery.photo }}
            />
            <GalleryLightbox
                images={images.map((image) => mediaUrl(image) ?? "")}
                index={open}
                onClose={() => setOpen(null)}
                labels={labels.gallery}
            />
        </div>
    );
}
