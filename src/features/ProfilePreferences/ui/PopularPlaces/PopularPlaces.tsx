import React, { FC, useEffect, useState } from "react";

import { popularPlacesData } from "../../model/data/mockedPopularPlacesData";

import styles from "./PopularPlaces.module.scss";
import { CategoryCard } from "../CategoryCard/CategoryCard";
import { SelectableGroup } from "@/shared/ui/SelectableGroup/SelectableGroup";

export const PopularPlaces: FC = () => {
    const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

    useEffect(() => {
        console.log(selectedPlaces);
    }, [selectedPlaces]);

    return (
        <div className={styles.wrapper}>
            <h3>Популярные места</h3>
            <SelectableGroup
                data={popularPlacesData}
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
