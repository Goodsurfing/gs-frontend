import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "react-i18next";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { ShortDescriptionProps } from "./types";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { THIS_FIELD_IS_REQUIRED } from "@/shared/constants/messages";
import { useErrorTranslate } from "../../hooks/useErrorTranslate";

const ShortDescription: FC<ShortDescriptionProps> = () => {
    const { control, formState: { errors } } = useFormContext();
    const { t } = useTranslation("offer");
    const { translate } = useErrorTranslate();

    return (
        <Controller
            name="shortDescription"
            control={control}
            rules={{ required: translate(THIS_FIELD_IS_REQUIRED) }}
            render={({ field }) => (
                <div>
                    <Textarea
                        value={field.value}
                        onChange={field.onChange}
                        label={t("description.Краткое описание")}
                        description={t("description.Не более 250 знаков")}
                        maxLength={250}
                    />
                    {errors.shortDescription && (
                        <ErrorText text={errors.shortDescription.message?.toString()} />
                    )}
                </div>
            )}
        />
    );
};

export default ShortDescription;
