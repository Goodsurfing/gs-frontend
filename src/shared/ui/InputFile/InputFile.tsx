import cn from "classnames";
import React, {
    forwardRef, LabelHTMLAttributes, useCallback, useMemo,
} from "react";

import { useDropzone } from "react-dropzone";
import { stringifyAllowedExtensions } from "@/shared/utils/files/stringifyAllowedExtensions";

import { InputFileProps } from "./InputFile.interfaces";
import styles from "./InputFile.module.scss";

const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
    (
        {
            id,
            imageURL,
            className,
            disabled = false,
            onChange,
            onDropFiles,
            value,
            wrapperClassName,
            uploadedImageClassName,
            labelClassName,
            labelDisableClassName,
            labelChildren,
            onLabelClick,
            accept,
            allowedExtensions,
            disableDropzone = false,
        },
        fileInputRef,
    ) => {
        const onLabelClickHandler = useCallback<
        NonNullable<LabelHTMLAttributes<HTMLLabelElement>["onClick"]>
        >(
            (e) => {
                if (disabled) return e.preventDefault();
                onLabelClick?.(e);
            },
            [disabled, onLabelClick],
        );

        const fileInputAccept = useMemo(() => {
            if (accept) return accept;
            if (allowedExtensions) return stringifyAllowedExtensions(allowedExtensions);
            return "image/*"; // по умолчанию разрешаем только изображения
        }, [accept, allowedExtensions]);

        // dropzone
        const onDrop = useCallback(
            (acceptedFiles: File[]) => {
                onDropFiles?.(acceptedFiles);
            },
            [onDropFiles],
        );

        const dropzoneProps = useDropzone({
            onDrop,
            disabled: disabled || disableDropzone,
            accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] }, // ограничиваем только изображениями
            multiple: false,
        });

        const { getRootProps, getInputProps, isDragActive } = dropzoneProps;

        return (
            <div
                {...(!disableDropzone
                    ? getRootProps({
                        className: cn(
                            styles.fileInputGroup,
                            wrapperClassName,
                            isDragActive && styles.fileInputGroupDragActive,
                        ),
                    })
                    : { className: cn(styles.fileInputGroup, wrapperClassName) })}
            >
                <input
                    {...(!disableDropzone ? getInputProps() : {})}
                    ref={fileInputRef}
                    className={cn(styles.fileInputGroup__fileInput, className)}
                    onChange={onChange}
                    value={value}
                    id={id}
                    accept={fileInputAccept}
                    disabled={disabled}
                />
                {imageURL && (
                    <img
                        className={cn(uploadedImageClassName, styles.uploadedImage)}
                        src={imageURL}
                        alt="Uploaded"
                    />
                )}
                <label
                    className={cn(
                        styles.fileInputGroup__label,
                        labelClassName,
                        disabled && styles.fileInputGroup__label_disabled,
                        disabled && labelDisableClassName,
                    )}
                    onClick={onLabelClickHandler}
                    htmlFor={id}
                >
                    {labelChildren}
                </label>
            </div>
        );
    },
);
export default InputFile;
