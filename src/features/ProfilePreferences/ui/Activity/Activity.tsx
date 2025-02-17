import React, { FC, memo, useState } from "react";

import { SelectableGroup } from "@/shared/ui/SelectableGroup/SelectableGroup";

import { CategoryCard } from "../CategoryCard/CategoryCard";
import styles from "./Activity.module.scss";
import { useCategories } from "@/shared/data/categories";

export const Activity: FC = memo(() => {
    const { tags } = useCategories();
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>
                Какой тип путешествий вы предпочитаете
            </h2>
            <div className={styles.wrapper}>
                <SelectableGroup
                    data={tags}
                    getKey={(item) => item.value}
                    onSelect={(value) => setSelectedActivities(value)}
                    renderItem={(category, onClick, isSelect) => (
                        <CategoryCard
                            category={{ image: category.image, text: category.text }}
                            onClick={onClick}
                            isSelect={isSelect}
                            key={category.value}
                        />
                    )}
                    selectedItems={selectedActivities}
                    containerStyle={styles.container}
                    multiSelect
                />
            </div>
        </div>
    );
});
