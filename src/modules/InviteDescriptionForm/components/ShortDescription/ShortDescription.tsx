import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "react-i18next";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { ShortDescriptionProps } from "./types";

const ShortDescription: FC<ShortDescriptionProps> = () => {
    const { control } = useFormContext();
    const { t } = useTranslation("offer");
    return (
        <Controller
            name="shortDescription"
            control={control}
            render={({ field }) => (
                <Textarea
                    value={field.value}
                    onChange={field.onChange}
                    label={t("description.Краткое описание")}
                    description={t("description.Не более 250 знаков")}
                    maxLength={250}
                />
            )}
        />
    );
};

export default ShortDescription;
