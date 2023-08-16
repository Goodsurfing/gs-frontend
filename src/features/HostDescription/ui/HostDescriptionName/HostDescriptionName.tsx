import { memo } from "react";
import { useFormContext } from "react-hook-form";

import { InputControl } from "@/shared/ui/InputControl/InputControl";

interface HostDescriptionNameProps {
    className?: string;
}

export const HostDescriptionName = memo((props: HostDescriptionNameProps) => {
    const { className } = props;

    const { control } = useFormContext();

    return (
        <InputControl
            className={className}
            name="organization"
            control={control}
        />
    );
});
