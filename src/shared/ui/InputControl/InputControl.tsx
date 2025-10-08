import { memo } from "react";
import {
    Control, Controller, FieldValues, Path, RegisterOptions,
} from "react-hook-form";
import Input, { InputProps } from "@/shared/ui/Input/Input";

interface InputControlProps<T extends FieldValues> extends Omit<InputProps, "name"> {
    name: Path<T>;
    control: Control<T>;
    rules?: RegisterOptions<T>;
    isError?: boolean;
}

const InputControlComponent = <T extends FieldValues>({
    name,
    control,
    rules,
    isError = false,
    ...restInputProps
}: InputControlProps<T>) => (
    <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field }) => (
            <Input
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isError={isError}
                {...restInputProps}
            />
        )}
    />
);

export const InputControl = memo(InputControlComponent) as typeof InputControlComponent;
