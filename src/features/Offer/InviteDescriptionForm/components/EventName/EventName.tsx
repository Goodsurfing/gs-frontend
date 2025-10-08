import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "@/shared/ui/Input/Input";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { useErrorTranslate } from "../../hooks/useErrorTranslate";

const EventName = () => {
    const { t } = useTranslation("offer");
    const { translate } = useErrorTranslate();

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
                    message: translate("Поле название вакансии не может быть пустымы"),
                },
            }}
            render={({ field }) => (
                <div>
                    <Input
                        label={t("description.Название мероприятия")}
                        value={field.value}
                        onChange={field.onChange}
                        isError={!!errors.title?.message}
                    />
                    {errors.title?.message && (
                        <ErrorText text={errors.title.message.toString()} />
                    )}
                </div>
            )}
        />
    );
};

export default EventName;
