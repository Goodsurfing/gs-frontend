import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { OfferCategories } from "@/widgets/OfferCategories";

import styles from "./Categories.module.scss";

const Categories = () => {
    const { control } = useFormContext();
    return (
        <div className={styles.wrapper}>
            <p className={styles.title}>Категория приглашения</p>
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
