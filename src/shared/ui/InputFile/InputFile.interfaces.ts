import React, { InputHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { AllowedFilesExtensions } from "@/shared/constants/files";

export type InputFileProps = {
    imageURL?: string | null;
    uploadedImageClassName?: string;
    wrapperClassName?: string;
    labelClassName?: string;
    labelDisableClassName?: string;
    labelChildren?: React.ReactNode | ReactNode[];
    onDropFiles?: (files: File[]) => void;
    disableDropzone?: boolean;
    onLabelClick?: MouseEventHandler<HTMLLabelElement>;
    allowedExtensions?: AllowedFilesExtensions[];
} & Required<Pick<InputHTMLAttributes<HTMLInputElement>, "id">> &
Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type">;
