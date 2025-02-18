import React, { FC, memo } from "react";

import { SelectableGroup } from "@/shared/ui/SelectableGroup/SelectableGroup";

import { CategoryCard } from "../CategoryCard/CategoryCard";
import styles from "./Activity.module.scss";
import { useCategories } from "@/shared/data/categories";

interface ActivityProps {
    value: string[];
    onChange: (value: string[]) => void;
}

export const Activity: FC<ActivityProps> = memo((props: ActivityProps) => {
    const { value, onChange } = props;
    const { tags } = useCategories();

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>
                Какой тип путешествий вы предпочитаете
            </h2>
            <div className={styles.wrapper}>
                <SelectableGroup
                    data={tags}
                    getKey={(item) => item.value}
                    onSelect={(valueItem) => onChange(valueItem)}
                    renderItem={(category, onClick, isSelect) => (
                        <CategoryCard
                            category={{ image: category.image, text: category.text }}
                            onClick={onClick}
                            isSelect={isSelect}
                            key={category.value}
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
