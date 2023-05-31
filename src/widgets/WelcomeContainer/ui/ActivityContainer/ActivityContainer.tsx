import { FC } from "react";

import { ActivityData } from "../../model/data/ActivityData/Activity.data";
import { MemoActivityItem as ActivityItem } from "../ActivityItem/ActivityItem";

import styles from "./ActivityContainer.module.scss";

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
