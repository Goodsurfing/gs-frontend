import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { SelectableGroup } from "@/shared/ui/SelectableGroup/SelectableGroup";

import { CategoryCard } from "../CategoryCard/CategoryCard";
import styles from "./Activity.module.scss";
import { useCategories } from "@/shared/data/categories";
import { useGetPublicCategoriesVacancyQuery } from "@/entities/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface ActivityProps {
    value: number[];
    onChange: (value: number[]) => void;
}

export const Activity: FC<ActivityProps> = memo((props: ActivityProps) => {
    const { value, onChange } = props;
    const { getTranslation } = useCategories();
    const { t } = useTranslation("profile");
    const { data: categoriesData, isLoading } = useGetPublicCategoriesVacancyQuery();

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    if (!categoriesData) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>
                {t("preferences.Какой тип путешествий вы предпочитаете")}
            </h2>
            <div className={styles.wrapper}>
                <SelectableGroup
                    data={categoriesData}
                    getKey={(item) => item.id}
                    onSelect={(valueItem) => onChange(valueItem)}
                    renderItem={(category, onClick, isSelect) => (
                        <CategoryCard
                            category={{
                                image: getMediaContent(category.imagePath) ?? "",
                                text: getTranslation(category.name) ?? "",
                            }}
                            onClick={onClick}
                            isSelect={isSelect}
                            key={category.id}
                        />
                    )}
                    selectedItems={value}
                    containerStyle={styles.container}
                    multiSelect
                />
            </div>
        </div>
    );
});
