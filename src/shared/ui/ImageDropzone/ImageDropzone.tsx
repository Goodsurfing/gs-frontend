import {
    FC, useEffect, useState, useCallback,
} from "react";
import { useDropzone, Accept } from "react-dropzone";
import cn from "classnames";
import styles from "./ImageDropzone.module.scss";
import { ErrorText } from "../ErrorText/ErrorText";
import { getMediaContent } from "@/shared/lib/getMediaContent";

export interface ImageDropzoneProps {
    value?: File | string;
    onChange: (file: File | undefined) => void;
    error?: boolean;
    accept?: Accept;
    maxSize?: number;
    className?: string;
}

export const ImageDropzone: FC<ImageDropzoneProps> = ({
    value,
    onChange,
    error: externalError = false,
    accept = {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
    },
    maxSize = 2 * 1024 * 1024, // 2 МБ
    className,
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

        const validMimeTypes = ["image/jpeg", "image/png"];
        if (!validMimeTypes.includes(file.type)) {
            return {
                valid: false,
                message: "Разрешены только JPG и PNG",
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
                {preview ? (
                    <div className={styles.preview}>
                        <img src={preview} alt="Preview" className={styles.previewImage} />
                    </div>
                ) : (
                    <p className={styles.placeholder}>
                        Перетащите изображение сюда или кликните для выбора
                    </p>
                )}
            </div>
            {internalError && <ErrorText text={internalError} />}
        </div>
    );
};
