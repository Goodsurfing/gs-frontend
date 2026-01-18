import React, { useState, useCallback, FC } from "react";
import { useDropzone } from "react-dropzone";
import cn from "classnames";
import { ReactSVG } from "react-svg";
import { useTranslation } from "react-i18next";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import styles from "./ImagesUploader.module.scss";
import plusIcon from "@/shared/assets/icons/plus-icon.svg";
import { GalleryItem, Image, MediaObjectType } from "@/types/media";
import { getMediaContent, getMediaContentsArray } from "@/shared/lib/getMediaContent";
import { ModalGallery } from "../ModalGallery/ModalGallery";
import fileIcon from "@/shared/assets/icons/skills/administration.svg";

type GalleryImage = MediaObjectType | GalleryItem | Image;

type Label = "Добавить фото" | "Добавить сертификат";

interface ImagesUploaderProps {
    uploadedImgs: MediaObjectType[] | GalleryItem[] | Image[];
    onUpload: (imgs: MediaObjectType[]) => Promise<void>;
    onDelete: (imgId: string) => void;
    onError: (error?: string) => void;
    isOnlyImgFormat?: boolean;
    maxLength?: number;
    label?: Label;
}

export const ImagesUploader: FC<ImagesUploaderProps> = (props) => {
    const {
        uploadedImgs, onUpload, onDelete, onError, isOnlyImgFormat = true,
        maxLength = 10,
        label = "Добавить фото",
    } = props;

    const { t } = useTranslation();
    const [files, setFiles] = useState<
    {
        file: File;
        preview: string;
        progress: number;
        id?: string;
        uploadedUrl?: string;
        error?: boolean;
        sizeError?: boolean;
        controller?: AbortController;
    }[]
    >([]);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [galleryItem, setGalleryItem] = useState<number>(0);

    const labelTranslate: Record<Label, string> = {
        "Добавить фото": t("Добавить фото"),
        "Добавить сертификат": t("Добавить сертификат"),
    };

    const uploadSingleFile = useCallback(
        async (f: typeof files[0]): Promise<MediaObjectType | null> => {
            if (f.sizeError) {
                setFiles((prev) => prev.map((item) => (item.file === f.file
                    ? { ...item, progress: 100, error: true } : item)));
                return null;
            }

            const controller = new AbortController();

            setFiles((prev) => prev.map((item) => (item.file === f.file
                ? { ...item, progress: 50, controller } : item)));

            try {
                const res = await uploadFile(f.file.name, f.file, controller.signal);

                if (res) {
                    setFiles((prev) => prev.filter((item) => item.file !== f.file));
                    return res;
                }

                return null;
            } catch (err: any) {
                if (err?.name === "AbortError") return null;

                setFiles((prev) => prev.map((item) => (item.file === f.file
                    ? { ...item, progress: 100, error: true } : item)));
                onError();
                return null;
            }
        },
        [onError],
    );

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const currentCount = uploadedImgs.length;
            const availableSlots = maxLength - currentCount;

            if (availableSlots <= 0) {
                onError(t("Нельзя загрузить больше 10 файлов"));
                return;
            }

            const filesToUpload = acceptedFiles.slice(0, availableSlots);

            const mappedFiles = filesToUpload.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                progress: 0,
                sizeError: file.size > 2 * 1024 * 1024,
            }));

            setFiles((prev) => [...prev, ...mappedFiles]);

            const uploadPromises = mappedFiles.map((f) => uploadSingleFile(f));
            const results = await Promise.all(uploadPromises);

            const uploaded = results.filter((r): r is MediaObjectType => !!r);

            if (uploaded.length > 0) {
                try {
                    await onUpload(uploaded);
                } catch {
                    onError();
                }
            }
        },
        [uploadedImgs.length, maxLength, onError, t, uploadSingleFile, onUpload],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: isOnlyImgFormat ? {
            "image/*": [],
        } : {
            "image/*": [],
            "application/pdf": [],
            "application/msword": [],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [], // .docx
        },
        onDrop,
        multiple: true,
    });

    const handleRemove = (name?: string, imgId?: string) => {
        setFiles((prev) => {
            const fileToRemove = prev.find((f) => f.file.name === name || f.id === imgId);
            if (fileToRemove?.controller) {
                fileToRemove.controller.abort();
            }

            if (imgId) {
                return prev.filter((f) => f.id !== imgId);
            }
            return prev.filter((f) => f.file.name !== name);
        });

        if (imgId) {
            onDelete(imgId);
        }
    };

    const getMedia = (img: GalleryImage): MediaObjectType => {
        if ("mediaObject" in img) {
        // GalleryItem
            return img.mediaObject;
        }
        if ("@id" in img) {
        // MediaObjectType
            return img as MediaObjectType;
        }
        return {
            "@id": img.id,
            id: img.id,
            contentUrl: img.contentUrl,
            mimeType: "image/jpeg",
            isImage: true,
            originalHeight: 0,
            originalWidth: 0,
            thumbnails: img.thumbnails,
        };
    };

    const getRemoveId = (img: GalleryImage): string => {
        if ("mediaObject" in img) {
        // GalleryItem
            return String(img.mediaObject.id);
        }
        if ("@id" in img) {
        // MediaObjectType
            return img.id;
        }
        // Image
        return img.id;
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const onlyImages = uploadedImgs
        .map((img) => getMedia(img))
        .filter((media) => media.isImage);

    return (
        <div className={styles.wrapper}>
            <div
                {...getRootProps()}
                className={cn(styles.buttonUpload, { [styles.active]: isDragActive })}
            >
                <input {...getInputProps()} />
                <ReactSVG className={styles.plusIcon} src={plusIcon} />
                {isDragActive ? (
                    <p>{t("Отпусти файлы здесь")}</p>
                ) : (
                    <p>{labelTranslate[label]}</p>
                )}
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {uploadedImgs.map((img) => {
                    const media = getMedia(img);

                    return (
                        <div className={styles.imgWrapper} key={media.id}>
                            {isOnlyImgFormat ? (
                                <img
                                    src={getMediaContent(media.contentUrl)}
                                    alt={media.contentUrl}
                                    onClick={() => {
                                        setModalOpen(true);
                                        const idx = onlyImages.findIndex((m) => m.id === media.id);
                                        setGalleryItem(idx);
                                    }}
                                    style={{ cursor: "pointer" }}
                                />
                            )
                                : (
                                    <a
                                        href={getMediaContent(media)}
                                        download
                                        className={cn(styles.file)}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <div className={styles.fileWrapper}>
                                            <ReactSVG src={fileIcon} />
                                        </div>
                                    </a>
                                )}
                            <button
                                type="button"
                                onClick={() => handleRemove(undefined, getRemoveId(img))}
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
                {files.map((f, index) => (
                    <div
                        className={styles.imgWrapper}
                        key={index}
                    >
                        {f.file.type.startsWith("image/") ? (
                            <img
                                src={f.preview}
                                alt={f.file.name}
                            />
                        ) : (
                            <div className={cn(styles.file)}>
                                <div className={styles.fileWrapper}>
                                    <ReactSVG src={fileIcon} />
                                </div>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => handleRemove(f.file.name, f.id)}
                        >
                            ×
                        </button>

                        {f.sizeError && (
                            <div className={styles.errorText}>
                                {t("Файл больше 2MB")}
                            </div>
                        )}

                        {(f.progress < 100 || f.error || f.sizeError) && (
                            <div
                                className={styles.progressWrapper}
                            >
                                <div
                                    className={cn(styles.progressInner, {
                                        [styles.error]: f.error,
                                    })}
                                    style={{ width: `${f.progress}%` }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <ModalGallery
                isOpen={isModalOpen}
                onClose={handleModalClose}
                images={getMediaContentsArray(onlyImages)}
                initialSlide={galleryItem}
            />
        </div>
    );
};
