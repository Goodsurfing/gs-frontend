import { FC } from "react";

import { ActivityData } from "./Activity.data";
import styles from "./ActivityContainer.module.scss";
import ActivityItem from "./ActivityItem/ActivityItem";

export const ActivityContainer: FC = () => (
    <div className={styles.wrapper}>
        {ActivityData.map((item) => (
            <ActivityItem
                title={item.title}
                image={item.image}
                path={item.path}
                key={item.title}
            />
        ))}
    </div>
);
