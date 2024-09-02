import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "react-i18next";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { FullDescriptionProps } from "./types";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { THIS_FIELD_IS_REQUIRED } from "@/shared/constants/messages";
import styles from "./FullDescription.module.scss";

const ShortDescription: FC<FullDescriptionProps> = () => {
    const { control, formState: { errors } } = useFormContext();
    const { t } = useTranslation("offer");
    return (
        <Controller
            name="fullDescription"
            control={control}
            rules={{ required: THIS_FIELD_IS_REQUIRED }}
            render={({ field }) => (
                <div>
                    <Textarea
                        classNameTextarea={styles.textarea}
                        value={field.value}
                        onChange={field.onChange}
                        label={t("description.Полное описание")}
                        description={t("description.Не более 3000 знаков")}
                        maxLength={3000}
                    />
                    {errors.fullDescription && (
                        <ErrorText text={errors.fullDescription.message?.toString()} />
                    )}
                </div>
            )}
        />
    );
};

export default ShortDescription;
