import React, { FC, memo, useState } from "react";

import { SelectableGroup } from "@/shared/ui/SelectableGroup/SelectableGroup";

import { popularPlacesData } from "../../model/data/mockedPopularPlacesData";
import { CategoryCard } from "../CategoryCard/CategoryCard";
import styles from "./PopularPlaces.module.scss";

export const PopularPlaces: FC = memo(() => {
    const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>Популярные места</h3>
            <SelectableGroup
                data={popularPlacesData}
                getKey={(item) => item.value}
                selectedItems={selectedPlaces}
                onSelect={(value) => setSelectedPlaces(value)}
                renderItem={(category, onClick, isSelect) => (
                    <CategoryCard
                        category={category}
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
