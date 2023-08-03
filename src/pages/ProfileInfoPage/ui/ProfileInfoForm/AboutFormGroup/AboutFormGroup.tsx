import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { IUserInfoForm } from "../ProfileInfoForm.interface";

interface AboutFormGroupProps {
    control: Control<IUserInfoForm>;
    isLocked: boolean;
}

const AboutFormGroup: FC<AboutFormGroupProps> = ({ control, isLocked }) => (
    <Controller
        control={control}
        name="description"
        render={({ field }) => (
            <Textarea
                id="description"
                onChange={(e) => field.onChange(e)}
                value={field.value}
                label="Расскажите о себе"
                disabled={isLocked}
            />
        )}
    />
);

export default AboutFormGroup;
