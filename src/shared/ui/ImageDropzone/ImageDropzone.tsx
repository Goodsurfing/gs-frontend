import {
    FC, useEffect, useState, useCallback,
} from "react";
import { useDropzone, Accept } from "react-dropzone";
import cn from "classnames";
import { ErrorText } from "../ErrorText/ErrorText";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { MiniLoader } from "../MiniLoader/MiniLoader";
import styles from "./ImageDropzone.module.scss";

export interface ImageDropzoneProps {
    value?: File | string | null;
    onChange: (file: File | undefined | null) => void;
    error?: boolean;
    accept?: Accept;
    maxSize?: number;
    className?: string;
    isLoading?: boolean;
}

export const ImageDropzone: FC<ImageDropzoneProps> = ({
    value,
    onChange,
    error: externalError = false,
    accept = {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "image/svg+xml": [".svg"],
    },
    maxSize = 2 * 1024 * 1024, // 2 МБ
    className,
    isLoading = false,
}) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [internalError, setInternalError] = useState<string | null>(null);

    useEffect(() => {
        if (!value) {
            setPreview(null);
        } else if (typeof value === "string") {
            setPreview(getMediaContent(value) ?? null);
        } else {
            const url = URL.createObjectURL(value);
            setPreview(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        }
        setInternalError(null);
    }, [value]);

    const validateFile = useCallback((file: File): { valid: boolean; message: string | null } => {
        if (file.size > maxSize) {
            return {
                valid: false,
                message: "Размер файла не должен превышать 2 МБ",
            };
        }

        const validMimeTypes = ["image/jpeg", "image/png", "image/svg+xml"];
        const validExtensions = [".jpg", ".jpeg", ".png", ".svg"];

        const fileExtension = file.name.toLowerCase().split(".").pop();
        const hasValidExtension = fileExtension ? validExtensions.includes(`.${fileExtension}`) : false;

        const hasValidMimeType = validMimeTypes.includes(file.type);

        if (!hasValidMimeType && !hasValidExtension) {
            return {
                valid: false,
                message: "Разрешены только JPG, PNG, SVG",
            };
        }

        return { valid: true, message: null };
    }, [maxSize]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setInternalError(null);

            if (acceptedFiles.length === 0) {
                onChange(undefined);
                return;
            }

            const file = acceptedFiles[0];
            const validationResult = validateFile(file);

            if (validationResult.valid) {
                onChange(file);
            } else {
                onChange(undefined);
                setInternalError(validationResult.message);
            }
        },
        [onChange, validateFile],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: 1,
    });

    const hasError = externalError || !!internalError;

    let dropzoneContent;

    if (isLoading) {
        dropzoneContent = <div className={styles.loading}><MiniLoader /></div>;
    } else if (preview) {
        dropzoneContent = (
            <div className={styles.preview}>
                <img src={preview} alt="Preview" className={styles.previewImage} />
            </div>
        );
    } else {
        dropzoneContent = (
            <p className={styles.placeholder}>
                Перетащите изображение сюда или кликните для выбора
            </p>
        );
    }

    return (
        <div>
            <div
                {...getRootProps()}
                className={cn(
                    styles.dropzone,
                    {
                        [styles.dropzoneActive]: isDragActive,
                        [styles.dropzoneError]: hasError,
                    },
                    className,
                )}
            >
                <input {...getInputProps()} />
                {dropzoneContent}
            </div>
            {internalError && <ErrorText text={internalError} />}
        </div>
    );
};
