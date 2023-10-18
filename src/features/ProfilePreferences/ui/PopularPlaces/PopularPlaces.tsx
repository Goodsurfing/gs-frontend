import React, { FC, useState } from "react";

import { popularPlacesData } from "../../model/data/mockedPopularPlacesData";

import styles from "./PopularPlaces.module.scss";
import { CategoryCard } from "../CategoryCard/CategoryCard";
import { SelectableGroup } from "@/shared/ui/SelectableGroup/SelectableGroup";

export const PopularPlaces: FC = () => {
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
};
