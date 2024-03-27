import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { OfferCategories } from "@/widgets/OfferCategories";

import styles from "./Categories.module.scss";

const Categories = () => {
    const { control } = useFormContext();
    const { t } = useTranslation("offer");
    return (
        <div className={styles.wrapper}>
            <p className={styles.title}>{t("description.Категория приглашения")}</p>
            <Controller
                name="category"
                control={control}
                render={({ field }) => (
                    <OfferCategories
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
        </div>
    );
};

export default Categories;
