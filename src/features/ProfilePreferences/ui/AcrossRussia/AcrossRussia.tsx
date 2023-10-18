import React, { FC, useState } from "react";

import { SelectableGroup } from "@/shared/ui/SelectableGroup/SelectableGroup";
import { acrossRussiaData } from "../../model/data/mockedPopularPlacesData";
import { CategoryCard } from "../CategoryCard/CategoryCard";

import styles from "./AcrossRussia.module.scss";

export const AcrossRussia:FC = () => {
    const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>По России</h3>
            <SelectableGroup
                data={acrossRussiaData}
                getKey={(item) => item.value}
                onSelect={(value) => setSelectedPlaces(value)}
                renderItem={(category, onClick, isSelect) => (
                    <CategoryCard
                        category={category}
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
};
