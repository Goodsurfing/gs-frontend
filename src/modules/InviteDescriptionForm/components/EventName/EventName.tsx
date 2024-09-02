import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "@/shared/ui/Input/Input";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";

const EventName = () => {
    const { t } = useTranslation("offer");
    const {
        control,
        formState: { errors },
    } = useFormContext();
    return (
        <Controller
            name="title"
            control={control}
            rules={{
                required: {
                    value: true,
                    message: t("description.Поле название вакансии не может быть пустымы"),
                },
            }}
            render={({ field }) => (
                <div>
                    <Input
                        label={t("description.Название мероприятия")}
                        value={field.value}
                        onChange={field.onChange}
                    />
                    {errors.title && (
                        <ErrorText text={errors.title.message?.toString()} />
                    )}
                </div>
            )}
        />
    );
};

export default EventName;
