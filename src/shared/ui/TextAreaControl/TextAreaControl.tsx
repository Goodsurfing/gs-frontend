import { memo } from "react";

import {
    Control, Controller, FieldValues, Path, RegisterOptions,
} from "react-hook-form";

import Textarea, { IText as TextAreaProps } from "../Textarea/Textarea";

interface TextAreaControlProps <T extends FieldValues> extends Omit<TextAreaProps, "name" | "control"> {
    name: Path<T>;
    control: Control<T>;
    rules?: RegisterOptions;
}

export const TextAreaControl = memo(<T extends FieldValues>(props: TextAreaControlProps<T>) => {
    const {
        control, label, rules, name, ...restTextAreaProps
    } = props;
    return (
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
});
