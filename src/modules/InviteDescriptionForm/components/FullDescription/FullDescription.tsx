import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "react-i18next";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { FullDescriptionProps } from "./types";

const ShortDescription: FC<FullDescriptionProps> = () => {
    const { control } = useFormContext();
    const { t } = useTranslation("offer");
    return (
        <Controller
            name="fullDescription"
            control={control}
            render={({ field }) => (
                <Textarea
                    value={field.value}
                    onChange={field.onChange}
                    label={t("description.Полное описание")}
                    description={t("description.Не более 3000 знаков")}
                    maxLength={3000}
                />
            )}
        />
    );
};

export default ShortDescription;
