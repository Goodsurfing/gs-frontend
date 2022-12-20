import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import InputField from "@/components/InputField/InputField";

interface AboutFormGroupProps {
    control: Control;
    isLocked: boolean;
}

const AboutFormGroup: FC<AboutFormGroupProps> = ({ control, isLocked }) => {
    return (
        <div>
            <Controller
                control={control}
                name={"about"}
                defaultValue={"Расскажите о себе"}
                render={({ field }) => (
                    <InputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        text={"Расскажите о себе"}
                        type={"text"}
                        disabled={isLocked}
                    />
                )}
            />
        </div>
    );
};

export default AboutFormGroup;
