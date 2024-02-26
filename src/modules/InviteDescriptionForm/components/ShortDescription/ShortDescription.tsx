import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

import Textarea from "@/shared/ui/Textarea/Textarea";

import { ShortDescriptionProps } from "./types";

const ShortDescription: FC<ShortDescriptionProps> = () => {
    const { control } = useFormContext();
    return (
        <Controller
            name="shortDescription"
            control={control}
            render={({ field }) => (
                <Textarea
                    value={field.value}
                    onChange={field.onChange}
                    label="Краткое описание"
                    description="Не более 250 знаков"
                    maxLength={250}
                />
            )}
        />
    );
};

export default ShortDescription;
