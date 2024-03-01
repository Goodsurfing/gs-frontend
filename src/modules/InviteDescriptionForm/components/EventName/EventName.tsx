import React from "react";

import { Controller, useFormContext } from "react-hook-form";
import Input from "@/shared/ui/Input/Input";

const EventName = () => {
    const { control } = useFormContext();
    return (
        <Controller
            name="title"
            control={control}
            render={({ field }) => (
                <Input
                    label="Название мероприятия"
                    value={field.value}
                    onChange={field.onChange}
                />
            )}
        />
    );
};

export default EventName;
