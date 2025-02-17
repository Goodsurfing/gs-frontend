import React, { FC, memo, useState } from "react";

import { SelectableGroup } from "@/shared/ui/SelectableGroup/SelectableGroup";

import { CategoryCard } from "../CategoryCard/CategoryCard";
import styles from "./PopularPlaces.module.scss";
import { usePopularPlaces } from "@/shared/data/popularPlaces";

export const PopularPlaces: FC = memo(() => {
    const { tags } = usePopularPlaces();
    const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>Популярные места</h3>
            <SelectableGroup
                data={tags}
                getKey={(item) => item.value}
                selectedItems={selectedPlaces}
                onSelect={(value) => setSelectedPlaces(value)}
                renderItem={(category, onClick, isSelect) => (
                    <CategoryCard
                        category={{ image: category.image, text: category.text }}
                        onClick={onClick}
                        isSelect={isSelect}
                    />
                )}
                containerStyle={styles.container}
                multiSelect
            />
        </div>
    );
});
