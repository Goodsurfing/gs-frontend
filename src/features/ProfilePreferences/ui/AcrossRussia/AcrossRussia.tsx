import React, { FC, memo, useState } from "react";

import { SelectableGroup } from "@/shared/ui/SelectableGroup/SelectableGroup";

import { CategoryCard } from "../CategoryCard/CategoryCard";
import styles from "./AcrossRussia.module.scss";
import { useAcrossRussia } from "@/shared/data/acrossRussia";

export const AcrossRussia: FC = memo(() => {
    const { tags } = useAcrossRussia();
    const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>По России</h3>
            <SelectableGroup
                data={tags}
                getKey={(item) => item.value}
                onSelect={(value) => setSelectedPlaces(value)}
                renderItem={(category, onClick, isSelect) => (
                    <CategoryCard
                        category={{ image: category.image, text: category.text }}
                        onClick={onClick}
                        isSelect={isSelect}
                    />
                )}
                selectedItems={selectedPlaces}
                containerStyle={styles.container}
                multiSelect
            />
        </div>
    );
});
