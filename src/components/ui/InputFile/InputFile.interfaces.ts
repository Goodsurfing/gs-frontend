import { AllowedFilesExtensions } from "@/constants/files";
import React, { InputHTMLAttributes, MouseEventHandler } from "react";

export type InputFileProps = {
    // isError: boolean;
    // setError: (isError: boolean) => void;
    // setInputValue: (value: string) => void;
    wrapperClassName?: string;
    maxSize?: number;
    labelClassName?: string;
    labelDisableClassName?: string;
    labelChildren?: React.ReactNode;
    onLabelClick?: MouseEventHandler<HTMLLabelElement>;
    allowedExtensions?: AllowedFilesExtensions[];
} & Required<Pick<InputHTMLAttributes<HTMLInputElement>, "id">> &
    Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type">;
