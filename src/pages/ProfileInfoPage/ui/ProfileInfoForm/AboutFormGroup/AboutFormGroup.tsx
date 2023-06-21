import Textarea from "@/UI/Textarea/Textarea";
import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import { IUserInfoForm } from "../ProfileInfoForm.interface";

interface AboutFormGroupProps {
    control: Control<IUserInfoForm>;
    isLocked: boolean;
}

const AboutFormGroup: FC<AboutFormGroupProps> = ({ control, isLocked }) => {
    return (
        <Controller
            control={control}
            name="description"
            render={({ field }) => {
                return (
                    <Textarea
                        id="description"
                        onChange={(e) => {
                            return field.onChange(e);
                        }}
                        value={field.value}
                        label="Расскажите о себе"
                        disabled={isLocked}
                    />
                );
            }}
        />
    );
};

export default AboutFormGroup;
