import { memo } from "react";
import {
    Control, Controller, FieldValues, Path, RegisterOptions,
} from "react-hook-form";
import Input, { InputProps } from "@/shared/ui/Input/Input";

interface InputControlProps<T extends FieldValues> extends Omit<InputProps, "name"> {
    name: Path<T>;
    control: Control<T>;
    rules?: RegisterOptions;
}

export const InputControl = memo(<T extends FieldValues>(props: InputControlProps<T>) => {
    const {
        name, control, rules, ...restInputProps
    } = props;

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field }) => (
                <Input
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    {...restInputProps}
                />
            )}
        />
    );
});
