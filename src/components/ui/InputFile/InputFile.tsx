import cn from "classnames";
import React, { vLabelHTMLAttributes, useCallback, useMemo } from "react";

import { stringifyAllowedExtensions } from "@/utils/files/stringifyAllowedExtensions";

import { InputFileProps } from "./InputFile.interfaces";
import styles from "./InputFile.module.scss";

const InputFile = React.forwardRef<HTMLInputElement, InputFileProps>(
    (
        {
            id,
            className,
            disabled,
            onChange,
            value,
            wrapperClassName,
            labelClassName,
            labelDisableClassName,
            labelChildren,
            onLabelClick,
            accept,
            allowedExtensions,
            ...restFileInputProps
        }: InputFileProps,
        fileInputRef
    ) => {
        const onLabelClickHandler = useCallback<
            NonNullable<LabelHTMLAttributes<HTMLLabelElement>["onClick"]>
        >(
            (e) => {
                if (disabled) return e.preventDefault();
                onLabelClick?.(e);
            },
            [disabled, onLabelClick]
        );

        const fileInputAccept = useMemo(() => {
            if (accept) return accept;
            return (
                allowedExtensions &&
                stringifyAllowedExtensions(allowedExtensions)
            );
        }, [accept, allowedExtensions]);

        return (
            <div className={cn(styles.fileInputGroup, wrapperClassName)}>
                <input
                    ref={fileInputRef}
                    className={cn(styles.fileInputGroup__fileInput, className)}
                    onChange={onChange}
                    type="file"
                    id={id}
                    disabled={disabled}
                    accept={fileInputAccept}
                    {...restFileInputProps}
                />

                <label
                    className={cn(
                        styles.fileInputGroup__label,
                        labelClassName,
                        disabled && styles.fileInputGroup__label_disabled,
                        disabled && labelDisableClassName
                    )}
                    onClick={onLabelClickHandler}
                    htmlFor={id}
                    children={labelChildren}
                />
            </div>
        );
    }
);
export default React.memo(InputFile);
