import cn from "classnames";
import React, { LabelHTMLAttributes, useCallback, useMemo } from "react";

import { stringifyAllowedExtensions } from "@/shared/utils/files/stringifyAllowedExtensions";

import { InputFileProps } from "./InputFile.interfaces";
import styles from "./InputFile.module.scss";

const InputFile = React.forwardRef<HTMLInputElement, InputFileProps>(
    (
        {
            id,
            imageURL,
            className,
            disabled = false,
            onChange,
            value,
            wrapperClassName,
            uploadedImageClassName,
            labelClassName,
            labelDisableClassName,
            labelChildren,
            onLabelClick,
            accept,
            allowedExtensions,
        }: InputFileProps,
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
            return (
                allowedExtensions
                && stringifyAllowedExtensions(allowedExtensions)
            );
        }, [accept, allowedExtensions]);

        return (
            <div className={cn(styles.fileInputGroup, wrapperClassName)}>
                <input
                    ref={fileInputRef}
                    className={cn(styles.fileInputGroup__fileInput, className)}
                    onChange={onChange}
                    value={value}
                    type="file"
                    id={id}
                    disabled={disabled}
                    accept={fileInputAccept}
                />
                {imageURL && <img className={cn(uploadedImageClassName, styles.uploadedImage)} src={imageURL} alt="Uploaded" />}
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
