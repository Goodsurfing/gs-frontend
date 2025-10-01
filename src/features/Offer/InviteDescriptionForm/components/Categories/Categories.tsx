import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { OfferCategories } from "@/widgets/OfferCategories";

import styles from "./Categories.module.scss";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { THIS_FIELD_IS_REQUIRED } from "@/shared/constants/messages";
import { useErrorTranslate } from "../../hooks/useErrorTranslate";

const Categories = () => {
    const { control, formState: { errors } } = useFormContext();
    const { t } = useTranslation("offer");
    const { translate } = useErrorTranslate();

    return (
        <div className={styles.wrapper}>
            <p className={styles.title}>{t("description.Категория приглашения")}</p>
            <Controller
                name="category"
                control={control}
                rules={{
                    validate: (value) => (Array.isArray(value)
                    && (value.length > 0)) || translate(THIS_FIELD_IS_REQUIRED),
                }}
                render={({ field }) => (
                    <>
                        <OfferCategories
                            value={field.value}
                            onChange={field.onChange}
                        />
                        {errors.category && (
                            <ErrorText text={errors.category.message?.toString()} />
                        )}
                    </>
                )}
            />
        </div>
    );
};

export default Categories;
