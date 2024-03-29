import React, { FC, memo, useState } from "react";

import { SelectableGroup } from "@/shared/ui/SelectableGroup/SelectableGroup";

import { activityData } from "../../model/data/mockedPopularPlacesData";
import { CategoryCard } from "../CategoryCard/CategoryCard";
import styles from "./Activity.module.scss";

export const Activity: FC = memo(() => {
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>
                Какой тип путешествий вы предпочитаете
            </h2>
            <div className={styles.wrapper}>
                <SelectableGroup
                    data={activityData}
                    getKey={(item) => item.value}
                    onSelect={(value) => setSelectedActivities(value)}
                    renderItem={(category, onClick, isSelect) => (
                        <CategoryCard
                            category={category}
                            onClick={onClick}
                            isSelect={isSelect}
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
