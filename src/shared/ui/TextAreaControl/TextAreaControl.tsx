import { memo } from "react";

import {
    Control, Controller, FieldValues, Path, RegisterOptions,
} from "react-hook-form";

import Textarea, { IText as TextAreaProps } from "../Textarea/Textarea";

interface TextAreaControlProps<T extends FieldValues> extends Omit<TextAreaProps, "name" | "control"> {
    name: Path<T>;
    control: Control<T>;
    rules?: RegisterOptions<T>;
}

const TextAreaControlComponent = <T extends FieldValues>({
    control,
    label,
    rules,
    name,
    ...restTextAreaProps
}: TextAreaControlProps<T>) => (
    <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field }) => (
            <Textarea
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={field.value}
                label={label}
                {...restTextAreaProps}
            />
        )}
    />
);

export const TextAreaControl = memo(TextAreaControlComponent) as typeof TextAreaControlComponent;
