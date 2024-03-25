import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

import Textarea from "@/shared/ui/Textarea/Textarea";

import { FullDescriptionProps } from "./types";

const ShortDescription: FC<FullDescriptionProps> = () => {
    const { control } = useFormContext();
    return (
        <Controller
            name="shortDescription"
            control={control}
            render={({ field }) => (
                <Textarea
                    value={field.value}
                    onChange={field.onChange}
                    label="Полное описание"
                    description="Не более 3000 знаков"
                    maxLength={3000}
                />
            )}
        />
    );
};

export default ShortDescription;
